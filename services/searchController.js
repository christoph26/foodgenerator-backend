'use strict';
var Recipe = require('../components/recipe/recipeSchema');
var RecipeFamily = require('../components/recipeFamily/recipeFamilySchema');
var IngredientList = require('../components/ingredientList/ingredientListSchema');
var Ingredient = require('../components/ingredient/ingredientSchema');
var Supermarket = require('../components/supermarket/supermarketSchema');

var async = require("async");


exports.searchIngredients = function (req, res) {
    if (!req.body.ingredients || req.body.ingredients == []) {
        res.status(400).send('Ingredients required.');
        return;
    }

    var query = Recipe.find();

    addVegetarianVeganAndEffortFilter(req, query);

    query.lean().exec(function (queryError, queryResult) {
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
// difference to the text search function starts here:
// supermarket filter works the same, but then function to compare the ingredients with the ingredientList form the ingredientSearch is called.
// afterwards the array of recipes is sorted


                //supermarket filter
                if (req.body.supermarketFilter && req.body.supermarketFilter.length > 0) {
                    var supermarketFilter = req.body.supermarketFilter;
                    async.filter(queryResult, getSupermarketfilterFunction(supermarketFilter),
                        function (filterError, filteredResults) {
                            if (filterError) {
                                res.status(500).send(filterError);
                                return;
                            }
                            //calculating the coverage for each recipe from the queryResult
                            for (var recipeCounter = 0; recipeCounter < queryResult.length; recipeCounter++) {
                                queryResult[recipeCounter].searchResult = compareLists(queryResult[recipeCounter].ingredientList, req.body.ingredients);
                            }

                            //sort function for the recipes to sort them by their match ingredients (from high to low)
                            if (queryResult.length > 1) {
                                queryResult.sort(function (a, b) {
                                    if (a.searchResult.match < b.searchResult.match) {
                                        return 1;
                                    }
                                    if (a.searchResult.match > b.searchResult.match) {
                                        return -1;
                                    }
                                    // a must be equal to b
                                    return 0;
                                });
                            }

                            replaceNotUsedIngredientsAndAttachToResponse(filteredResults, res);

                        });

                } else {


                    //calculating the coverage for each recipe from the queryResult
                    for (var recipeCounter = 0; recipeCounter < queryResult.length; recipeCounter++) {
                        queryResult[recipeCounter].searchResult = compareLists(queryResult[recipeCounter].ingredientList, req.body.ingredients);
                    }

                    //sort function for the recipes to sort them by their match ingredients (from high to low)
                    if (queryResult.length > 1) {
                        queryResult.sort(function (a, b) {
                            if (a.searchResult.match < b.searchResult.match) {
                                return 1;
                            }
                            if (a.searchResult.match > b.searchResult.match) {
                                return -1;
                            }
                            // a must be equal to b
                            return 0;
                        });
                    }

                    replaceNotUsedIngredientsAndAttachToResponse(queryResult, res);

                }
            });
    });


};


function replaceNotUsedIngredientsAndAttachToResponse(recipeList, response) {

    //forEach over all resultrecipes
    async.forEach(recipeList, function (recipe, forEachCallback) {

            //replace NotUsedIngredients-List of each recipe by async-map
            var ingredientIdList = recipe.searchResult.notUsedIngredients;
            async.map(ingredientIdList, function (ingredientId, mapcallback) {
                Ingredient.findById(ingredientId, function (error, resultIngredient) {
                    if (error) {
                        mapcallback(error);
                        return;
                    }

                    mapcallback(null, resultIngredient);
                });
            }, function (mapError, resultIngredients) {
                if (mapError) {
                    forEachCallback(mapError);
                    return;
                }

                recipe.searchResult.notUsedIngredients = resultIngredients;
                forEachCallback();

            });
        }
        , function (forEachError) {
            if (forEachError) {
                response.status(500).send(forEachError);
                return;
            }

            response.json(recipeList);

        });
}


//returns the % of the coverage of ingredients from list A by list B
// (how many % of the ingredients of list A are in list B)

function compareLists(ingredientListA, searchIngredientList) {
    var matches = 0; //count of ingredients from the search that are in the given recipe
    var notUsedIngredientcounter = 0; // counter to store the not used Ingredient in the right space
    var notUsedIngredients = [];// array with the not used Ingredients from the search term

    for (var searchListIndex = 0; searchListIndex < searchIngredientList.length; searchListIndex++) { //for each ingredient from the search
        var notMatched = 0;
        for (var listAIndex = 0; listAIndex < ingredientListA.length; listAIndex++) { // check if the ingredients from the recipe are the same
            if (String(ingredientListA[listAIndex]._id) === String(searchIngredientList[searchListIndex])) {
                matches = matches + 1; //
            } else {
                notMatched = notMatched + 1; // count if the ingredient is not the same
            }
        }
        if (notMatched == listAIndex) { // if notMatched = the amount of ingredient of the recipe, the ingredient from the search is not used in this recipe
            notUsedIngredients[notUsedIngredientcounter] = searchIngredientList[searchListIndex];
            notUsedIngredientcounter = notUsedIngredientcounter+1;
        }
        notMatched = 0;
    }
    return {
        match: matches,
        notUsedIngredients: notUsedIngredients
    };
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
        return;
    }


    if (req.body.searchDirectRecipes) {

        var recipeQuery = Recipe.find({$text: {$search: req.body.searchText}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}});

        addVegetarianVeganAndEffortFilter(req, recipeQuery);

        recipeQuery.lean().exec(function (queryError, queryResult) {
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
                        async.filter(queryResult, getSupermarketfilterFunction(supermarketFilter),
                            function (filterError, filteredResults) {
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

exports.calculateAvailableSupermarketsAndReplaceIngredientListOfRecipe = calculateAvailableSupermarketsAndReplaceIngredientListOfRecipe;

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
                        return;
                    }
                    ingredientList = result.ingredients;
                    loadCallback();
                });
            },
            function (loadCallback) {
                Supermarket.find().lean().exec(function (err, result) {
                    if (err) {
                        loadCallback(err);
                        return;
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
                return;
            }

            //load ingredients of current ingredientList
            async.map(ingredientList, function (ingredientId, loadIngredientCallback) {
                Ingredient.findById(ingredientId.ingredient).lean().exec(function (err, ingredient) {
                    if (err) {
                        loadIngredientCallback(err);
                        return;
                    }
                    loadIngredientCallback(null, ingredient);
                });
            }, function (mapError, listOfIngredients) {
                if (mapError) {
                    callback(mapError);
                    return;
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
                        return;
                    }

                    //Load supermarkets form Id-list
                    async.map(reduction, function (supermarketId, mapCallback) {
                        Supermarket.findById(supermarketId).lean().exec(function (loadError, supermarket) {
                            if (loadError) {
                                mapCallback(loadError);
                                return;
                            }

                            mapCallback(null, supermarket);
                        })
                    }, function (mapError, loadedSupermarkets) {
                        if (mapError) {
                            callback(mapError);
                            return;
                        }
                        recipe.availability = loadedSupermarkets;
                        callback();
                    });

                });
            });
        }
    );
}

function addVegetarianVeganAndEffortFilter(req, query) {
//Filter for vegetarian and vegan flags
    if (typeof req.body.vegetarian !== 'undefined' && req.body.vegetarian) {
        query.where("vegetarian", true);
    } else if (typeof req.body.vegan !== 'undefined' && req.body.vegan) {
        query.where("vegan", true);
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
        query.or(effortFilter);
    }
}

function getSupermarketfilterFunction(filter) {
    return function (recipe, filterCallback) {

        var passedFilter = false;
        //Check if elements of supermarket filter are in the availabilty list of the current recipe
        var availabilityIdList = recipe.availability.map(function (item) {
            return String(item._id);
        });
        for (var i = 0; i < filter.length; i++) {
            passedFilter = passedFilter || (availabilityIdList.indexOf(filter[i]) >= 0);
        }

        filterCallback(null, passedFilter);
    }
}