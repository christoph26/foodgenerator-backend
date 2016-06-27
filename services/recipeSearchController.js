'use strict';
var Recipe = require('../components/recipe/recipeSchema');
var RecipeFamily = require('../components/recipeFamily/recipeFamilySchema');
var IngredientList = require('../components/ingredientList/ingredientListSchema');
var Ingredient = require('../components/ingredient/ingredientSchema');
var Supermarket = require('../components/supermarket/supermarketSchema');

var async = require("async");


//need: body: "ingredients":["ingredient":"00000001"] <- list of ingredients (_ids!)
/*
 exports.searchIngredients = function (req, res) {
 if (!req.body.ingredients || req.body.ingredients == "") {
 res.status(400).send('Ingredients required.');
 return;
 }


 var recipeQuery = Recipe.find();

 recipeQuery.lean().exec(function (recipeError, allRecipes) {
 if (recipeError) {
 res.status(500).send(recipeError);
 return;
 }
 else

 var ingredientListQuery = IngredientList.find();
 ingredientListQuery.lean().exec(function (ingredientListError, allIngredientLists) {
 if (ingredientListError) {
 res.status(500).send(ingredientListError);
 return;
 }
 else
 //calculating the coverage for each ingredientList
 for (var ii = 0; ii < allIngredientLists.length; ii++) {
 allIngredientLists[ii].coverage = compareLists(allIngredientLists[ii], req.body);
 }

 //mapping the ingredientList to the recipes
 for (var xx = 0; xx < allRecipes.length; xx++) {
 for (var yy = 0; yy < allIngredientLists.length; yy++) {
 if (String(allRecipes[xx].ingredientList) == String(allIngredientLists[yy]._id)) {
 allRecipes[xx].ingredientList = allIngredientLists[yy];
 }
 }
 }

 //sort function for the recipes to sort them by their coverage (from high to low coverage)
 allRecipes.sort(function (a, b) {
 if (a.ingredientList.coverage < b.ingredientList.coverage) {
 return 1;
 }
 if (a.ingredientList.coverage > b.ingredientList.coverage) {
 return -1;
 }
 // a must be equal to b
 return 0;
 });

 //res.json(result);
 //checking wich ingredients are missing for each recipe and adding them to a new array: missingIngredients
 for (var x = 0; x < allRecipes.length; x++) {
 var missingIngredients = [];
 var counter = 0;
 for (var y = 0; y < allRecipes[x].ingredientList.ingredients.length; y++) {
 var found = 0;

 for (var z = 0; z < req.body.ingredients.length; z++) {
 if (String(allRecipes[x].ingredientList.ingredients[y].ingredient) === String(req.body.ingredients[z].ingredient)) {
 found = 1;
 }
 }
 if (found == 0) {
 missingIngredients[counter] = allRecipes[x].ingredientList.ingredients[y].ingredient;
 counter = counter + 1;
 }

 }
 allRecipes[x].missingIngredients = missingIngredients;
 }


 //getting ingredient titles for the missing ingredients
 var ingredientQuery = Ingredient.find();

 ingredientQuery.lean().exec(function (ingredientError, allIngredients) {
 if (ingredientError) {
 res.status(500).send(ingredientError);
 return;
 }
 else
 for (var x = 0; x < allRecipes.length; x++) {
 if (!allRecipes[x].missingIngredients || allRecipes[x].missingIngredients == "") {

 } else {
 for (var y = 0; y < allRecipes[x].missingIngredients.length; y++) {
 for (var z = 0; z < allIngredients.length; z++) {
 if (String(allRecipes[x].missingIngredients[y]) === String(allIngredients[z]._id)) {
 allRecipes[x].missingIngredients[y] = allIngredients[z];
 }
 }
 }
 }
 }
 //map ingredients to the ids of the ingredientLists
 for (var xxx = 0; xxx < allRecipes.length; xxx++) {
 for (var yyy = 0; yyy < allRecipes[xxx].ingredientList.ingredients.length; yyy++) {
 for (var zzz = 0; zzz < allIngredients.length; zzz++) {
 if (String(allRecipes[xxx].ingredientList.ingredients[yyy].ingredient) === String(allIngredients[zzz]._id)) {
 allRecipes[xxx].ingredientList.ingredients[yyy] = allIngredients[zzz];
 }
 }
 }

 }
 // getting the supermarkts in denen ALLE ingredients eines recipes verfügbar sind
 for (var xxxx = 0; xxxx < allRecipes.length; xxxx++) {
 var supermarketsAvailable = [];
 var supermarketcounter = 0;
 for (var zzzz = 0; zzzz < allRecipes[xxxx].ingredientList.ingredients[0].supermarkets.length; zzzz++) {

 var availableCounter = 1;
 for (var yyyy = 1; yyyy < allRecipes[xxxx].ingredientList.ingredients.length; yyyy++) {

 for (var aaaa = 0; aaaa < allRecipes[xxxx].ingredientList.ingredients[yyyy].supermarkets.length; aaaa++) {
 if (String(allRecipes[xxxx].ingredientList.ingredients[0].supermarkets[zzzz]) === String(allRecipes[xxxx].ingredientList.ingredients[yyyy].supermarkets[aaaa])) {
 availableCounter = availableCounter + 1;
 }
 }
 }

 if (availableCounter == yyyy) {
 supermarketsAvailable[supermarketcounter] = allRecipes[xxxx].ingredientList.ingredients[0].supermarkets[zzzz];
 supermarketcounter = supermarketcounter + 1;


 }
 }
 allRecipes[xxxx].availableSupermarkets = supermarketsAvailable;

 }


 var supermarketsQuery = Supermarket.find();

 supermarketsQuery.lean().exec(function (queryError4, queryResult4) {
 if (queryError4) {
 res.status(500).send(queryError4);
 return;
 }
 else
 for (var blar = 0; blar < allRecipes.length; blar++) {
 for (var blur = 0; blur < allRecipes[blar].availableSupermarkets.length; blur++) {
 for (var blir = 0; blir < queryResult4.length; blir++) {
 if (String(allRecipes[blar].availableSupermarkets[blur]) === String(queryResult4[blir]._id)) {
 allRecipes[blar].availableSupermarkets[blur] = queryResult4[blir];
 }
 }

 }
 }
 res.json(allRecipes);
 });


 //for debugging only
 //                for (var i = 0; i < allRecipes.length; i++) {
 //                    console.log("recipe" + i);
 //                    for (var j = 0; j < allRecipes[i].missingIngredients.length; j++) {
 //                        console.log(allRecipes[i].missingIngredients[j].title);
 //                    }
 //                    console.log("--------------");
 //                }

 });


 });


 });


 };
 */
exports.searchIngredients = function (req, res) {
    if (!req.body.ingredients || req.body.ingredients == "") {
        res.status(400).send('Ingredients required.');
        return;
    }

    var query = Recipe.find();

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
                    }

                    mapcallback(null, resultIngredient);
                });
            }, function (mapError, resultIngredients) {
                if (mapError) {
                    forEachCallback(mapError);
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

    for (var counterB = 0; counterB < searchIngredientList.length; counterB++) { //for each ingredient from the search
        var noMatch = 0;
        for (var counterA = 0; counterA < ingredientListA.length; counterA++) { // check if the ingredients from the recipe are the same
            if (String(ingredientListA[counterA]._id) === String(searchIngredientList[counterB])) {
                matches = matches + 1; //
            } else {
                noMatch = noMatch + 1; // count if the ingredient is not the same
            }
        }
        if (noMatch == counterA) { // if noMatch = the amount of ingredient of the recipe, the ingredient from the search is not used in this recipe
            notUsedIngredients[notUsedIngredientcounter] = searchIngredientList[counterB];
        }
        noMatch = 0;
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

    }


    if (req.body.searchDirectRecipes) {

        var recipeQuery = Recipe.find({$text: {$search: req.body.searchText}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}});

        //Filter for vegetarian and vegan flags
        if (typeof req.body.vegetarian !== 'undefined' && req.body.vegetarian) {
            recipeQuery.where("vegetarian", true);
        } else if (typeof req.body.vegan !== 'undefined' && req.body.vegan) {
            recipeQuery.where("vegan", true);
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
            recipeQuery.or(effortFilter);
        }

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