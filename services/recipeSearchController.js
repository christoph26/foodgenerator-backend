'use strict';
var Recipe = require('../components/recipe/recipeSchema');
var RecipeFamily = require('../components/recipeFamily/recipeFamilySchema');
var IngredientList = require('../components/ingredientList/ingredientListSchema');
var Ingredient = require('../components/ingredient/ingredientSchema');
var Supermarket = require('../components/supermarket/supermarketSchema');

var async = require("async");


//need: body: "ingredients":["ingredient":"00000001"] <- list of ingredients (_ids!)

exports.searchIngredients = function (req, res) {
    if (!req.body.ingredients || req.body.ingredients == "") {
        res.status(400).send('Ingredients required.');
        return;
    }


    var query2 = Recipe.find();

    query2.lean().exec(function (queryError2, queryResult2) {
        if (queryError2) {
            res.status(500).send(queryError2);
            return;
        }
        else

            var query = IngredientList.find();
        query.lean().exec(function (queryError, queryResult) {
            if (queryError) {
                res.status(500).send(queryError);
                return;
            }
            else

                for (var ii = 0; ii < queryResult.length; ii++) {
                    queryResult[ii].coverage = compareLists(queryResult[ii], req.body);
                }

            //var result = queryResult[0].coverage.toString() + ", " + queryResult[1].coverage.toString() + ", " + queryResult[2].coverage.toString() + ", " + queryResult[3].coverage.toString() + ", " + queryResult[4].coverage.toString();
            //res.json(result);
            //console.log(result);

            for (var xx = 0; xx < queryResult2.length; xx++) {
                for (var yy = 0; yy < queryResult.length; yy++) {
                    if (String(queryResult2[xx].ingredientList) == String(queryResult[yy]._id)) {
                        queryResult2[xx].ingredientList = queryResult[yy];
                    }
                }
            }


            queryResult2.sort(function (a, b) {
                if (a.ingredientList.coverage < b.ingredientList.coverage) {
                    return 1;
                }
                if (a.ingredientList.coverage > b.ingredientList.coverage) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

            //var result = queryResult[0].coverage.toString() + ", " + queryResult[1].coverage.toString() + ", " + queryResult[2].coverage.toString() + ", " + queryResult[3].coverage.toString() + ", " + queryResult[4].coverage.toString();
            //var result = queryResult2[0].title + ", " + queryResult2[1].title + ", " + queryResult2[2].title + ", " + queryResult2[3].title + ", " + queryResult2[4].title;

            //console.log(result);
            //res.json(result);
            for (var x = 0; x < queryResult2.length; x++) {
                var missingIngredients = [];
                var counter = 0;
                for (var y = 0; y < queryResult2[x].ingredientList.ingredients.length; y++) {
                    var found = 0;

                    for (var z = 0; z < req.body.ingredients.length; z++) {
                        if (String(queryResult2[x].ingredientList.ingredients[y].ingredient) === String(req.body.ingredients[z].ingredient)) {
                            found = 1;
                        }
                    }
                    if (found == 0) {
                        missingIngredients[counter] = queryResult2[x].ingredientList.ingredients[y].ingredient;
                        counter = counter + 1;
                    }

                }
                queryResult2[x].missingIngredients = missingIngredients;
            }

//for debugging only
            for (var i = 0; i < queryResult2.length; i++) {
                console.log("recipe" + i);
                for (var j = 0; j < queryResult2[i].missingIngredients.length; j++) {
                    console.log(queryResult2[i].missingIngredients[j]);
                }
                console.log("--------------");
            }


        });


    });


};


//returns the % of the coverage of ingredients from list A by list B
// (how many % of the ingredients of list A are in list B)

function compareLists(ingredientListA, ingredientListB) {
    var matches = 0;
    for (var i = 0; i < ingredientListA.ingredients.length; i++) {
        for (var j = 0; j < ingredientListB.ingredients.length; j++) {
            if (String(ingredientListA.ingredients[i].ingredient) === String(ingredientListB.ingredients[j].ingredient)) {
                matches = matches + 1;
            }
        }
    }


    return 100 / i * matches;
}

/*
 expected body structure:
 {
 searchtext: nonempty String, required
 searchDirectRecipes: boolean, required
 vegetarian: boolean, default false
 vegan: boolean, default false
 effortLow: boolean, default false
 effortMedium: boolean, default false
 effortHigh: boolean, default false
 }
 */
exports.searchRecipes = function (req, res) {

    if (!req.body.searchText || req.body.searchText == "") {
        res.status(400).send('Search text required.');
        return;
    }
    if (typeof req.body.searchDirectRecipes === 'undefined') {
        res.status(400).send("Attribute 'searchDirectRecipes' required");

    }


    if (req.body.searchDirectRecipes) {

        var query2 = Recipe.find({$text: {$search: req.body.searchText}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}});

        //Filter for vegetarian and vegan flags
        if (typeof req.body.vegetarian !== 'undefined' && req.body.vegetarian) {
            query2.where("vegetarian", true);
        } else if (typeof req.body.vegan !== 'undefined' && req.body.vegan) {
            query2.where("vegan", true);
        }

        //filter for effort
        var effortFilter = [];
        if (typeof req.body.effortLow !== 'undefined' && req.body.effortLow) {
            effortFilter.push({effort: 1});
        }
        if (typeof req.body.effortMedium !== 'undefined' && req.body.effortMedium) {
            effortFilter.push({effort: 2});
        }
        if (typeof req.body.effortHigh !== 'undefined' && req.body.effortHigh) {
            effortFilter.push({effort: 3});
        }
        if (effortFilter.length > 0) {
            query2.or(effortFilter);
        }

        query2.lean().exec(function (queryError, queryResult) {
            if (queryError) {
                res.status(500).send(queryError);
                return;
            }


            //Calculate supermarket availabilities:
            async.forEach(queryResult, function (recipe, forEachCallback) {
                    calculateAvailableSupermarketsAndReplaceIngredientListOfRecipe(recipe, forEachCallback);
                }
                , function (forEachError) {
                    if (forEachError) {
                        res.status(500).send(forEachError);
                        return;
                    }

                    //supermarket filter
                    if (req.body.supermarketFilter && req.body.supermarketFilter.length > 0) {
                        var supermarketFilter = req.body.supermarketFilter;
                        async.filter(queryResult, function (recipe, filterCallback) {

                            var passedFilter = false;
                            //Check if elements of supermarket filter are in the availabilty list of the current recipe
                            var availabilityIdList = recipe.availability.map(function (item) {
                                return String(item._id);
                            });
                            for (var i = 0; i < supermarketFilter.length; i++) {
                                passedFilter = passedFilter || (availabilityIdList.indexOf(supermarketFilter[i]) >= 0);
                            }

                            filterCallback(null, passedFilter);
                        }, function (filterError, filteredResults) {
                            if (filterError) {
                                res.status(500).send(filterError);
                                return;
                            }


                            res.json(filteredResults);
                        });

                    } else {
                        res.json(queryResult);

                    }
                });
        });


    } else {
        var query = RecipeFamily.find({'$text': {'$search': req.body.searchText}});

        //Execute Text search
        query.lean().exec(function (queryError, queryResult) {
            if (queryError) {
                res.status(500).send(queryError);
                return;
            }


            //load default recipes of recipe families
            async.map(queryResult, function (recipeFamily, mapCallback) {
                Recipe.findById(recipeFamily.defaultrecipe).lean().exec(function (loadDefaultRecipeError, defaultrecipe) {
                    if (loadDefaultRecipeError) {
                        mapCallback(loadDefaultRecipeError);
                    }

                    mapCallback(null, defaultrecipe);
                });
            }, function (mapError, defaultrecipes) {
                if (mapError) {
                    res.status(500).send(mapError);
                    return;
                }

                //Calculate supermarket availabilities:
                async.forEach(defaultrecipes, function (recipe, forEachCallback) {
                        calculateAvailableSupermarketsAndReplaceIngredientListOfRecipe(recipe, forEachCallback);
                    }
                    , function (forEachError) {
                        if (forEachError) {
                            res.status(500).send(forEachError);
                            return;
                        }

                        res.json(defaultrecipes);
                    });
            });

        });


    }
};

function calculateAvailableSupermarketsAndReplaceIngredientListOfRecipe(recipe, callback) {

    var ingredientList;
    var supermarkets;

    //load ingredientList of current recipe and supermarkets
    async.parallel(
        [
            function (loadCallback) {
                IngredientList.findById(recipe.ingredientList).lean().exec(function (err, result) {
                    if (err) {
                        loadCallback(err);
                    }
                    ingredientList = result.ingredients;
                    loadCallback();
                });
            },
            function (loadCallback) {
                Supermarket.find().lean().exec(function (err, result) {
                    if (err) {
                        loadCallback(err);
                    }
                    supermarkets = result.map(function (elem) {
                        return elem._id;
                    });
                    loadCallback();
                });
            }
        ]
        , function (parallelError) {
            if (parallelError) {
                callback(parallelError);
            }

            //load ingredients of current ingredientList
            async.map(ingredientList, function (ingredientId, loadIngredientCallback) {
                Ingredient.findById(ingredientId.ingredient).lean().exec(function (err, ingredient) {
                    if (err) {
                        loadIngredientCallback(err);
                    }
                    loadIngredientCallback(null, ingredient);
                });
            }, function (mapError, listOfIngredients) {
                if (mapError) {
                    callback(mapError);
                }

                //replace reference to supermarketList with List of ingredients
                recipe.ingredientList = listOfIngredients;
                var supermarketListsOfIngredients = listOfIngredients.map(function (ingredient) {
                    return ingredient.supermarkets;
                });

                async.reduce(supermarketListsOfIngredients, supermarkets, function (availabilityState, supermarketsOfIngredient, reduceCallback) {
                    if (availabilityState.length == 0) {
                        reduceCallback(null, []);
                    }


                    var newAvailabilityState = [];

                    for (var i = 0; i < availabilityState.length; i++) {
                        for (var j = 0; j < supermarketsOfIngredient.length; j++) {
                            if (String(availabilityState[i]) === String(supermarketsOfIngredient[j])) {
                                newAvailabilityState.push(String(availabilityState[i]));
                            }
                        }
                    }

                    reduceCallback(null, newAvailabilityState);
                }, function (reduceError, reduction) {
                    if (reduceError) {
                        callback(reduceError);
                    }

                    //Load supermarkets form Id-list
                    async.map(reduction, function (supermarketId, mapCallback) {
                        Supermarket.findById(supermarketId).lean().exec(function (loadError, supermarket) {
                            if (loadError) {
                                mapCallback(loadError);
                            }

                            mapCallback(null, supermarket);
                        })
                    }, function (mapError, loadedSupermarkets) {
                        if (mapError) {
                            callback(mapError)
                        }
                        recipe.availability = loadedSupermarkets;
                        callback();
                    });

                });
            });
        }
    );
}