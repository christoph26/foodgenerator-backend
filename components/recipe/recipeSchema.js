// Load required packages
var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

// Define our Recipe schema
var Recipe = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            index: true
        }, //title of the recipe
        effort: {
            type: Number,
            required: true,
            min: 1,
            max: 3
        }, //skill level of the recipe
        description: {
            type: String,
            required: true
        }, //cooking description of the recipe
        vegan: {
            type: Boolean,
            required: true
        }, //vegan?
        vegetarian: {
            type: Boolean,
            required: true
        }, //vegetarian?
        picture: {
            type: String,
            required: true
        },
        //ingredient list: list of tuple with ingredient and amount (incl. unit of measurement) of the ingredient
        ingredientList: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'IngredientList',
            required: true
        },
// recipe family: group of recipes that belongs together
        recipeFamily: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RecipeFamily',
            required: true
        }
    })
    ;
Recipe.plugin(idvalidator);
Recipe.index({title: 'text'});
Recipe.index({vegetarian: 1});
Recipe.index({vegan: 1});


// Export the Mongoose model
module.exports = mongoose.model('Recipe', Recipe);