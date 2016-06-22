var Recipe = require('./recipeSchema');
var base = require('../base');
var mongoose = require('mongoose');

// Create endpoint /api/recipe/:id for GET
exports.getRecipe = base.getEntityById(Recipe)


exports.getRecipeOfFamily = function (req, res) {

    if (!req.body.recipeFamilyId) {
        res.status(400).send('Recipefamily ID required.');
        return;
    }
    if (!req.body.currentRecipeId) {
        res.status(400).send("Current recipe ID required");
        return;
    }

    //Find all recipes with specified recipeFamily and an different id than currentRecipeId
    Recipe.find({
        recipeFamily: req.body.recipeFamilyId,
        "_id": {"$ne": mongoose.Types.ObjectId(req.body.currentRecipeId)}
    }).lean().exec(function (error, result) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        res.json(result);
    });

}