var Recipe = require('./recipeSchema');
var base = require('../base');
var mongoose = require('mongoose');
var service = require('../../services/searchController')
var async = require("async");

// Create endpoint /api/recipe/:id for GET
exports.getRecipe = base.getEntityById(Recipe);


exports.getOtherRecipesOfFamily = function (req, res) {

    //Find the recipeFamily of the recipe with the passed id.
    Recipe.findById(req.params.id).select('recipeFamily').lean().exec(function (error, result) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        // Find and return the other recipes of the found family.
        Recipe.find({
            recipeFamily: result.recipeFamily,
            "_id": {"$ne": mongoose.Types.ObjectId(req.params.id)}
        }).lean().exec(function (error2, otherRecipesOfFamily) {
            if (error2) {
                res.status(500).send(error2);
                return;
            }

            //Calculate supermarket availabilities:
            async.forEach(otherRecipesOfFamily, function (recipe, forEachCallback) {
                    service.calculateAvailableSupermarketsAndReplaceIngredientListOfRecipe(recipe, forEachCallback);
                }
                , function (forEachError) {
                    if (forEachError) {
                        res.status(500).send(forEachError);
                        return;
                    }

                    res.json(otherRecipesOfFamily);
                });
        });

    })
};