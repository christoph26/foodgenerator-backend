// Load required packages
var mongoose = require('mongoose');

// Define our Recipe schema
var Recipe = new mongoose.Schema({
        title: String, //title of the recipe
        skill: Number, //skill level of the recipe
        description: String, //cooking description of the recipe
        vegan: Boolean, //vegan?
        vegetarian: Boolean, //vegetarian?
    //ingredient list: list of tuple with ingredient and amount (incl. unit of measurement) of the ingredient
        ingredientlist: [{
            amount: Number,
            unit: String,
            ingredient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ingredient'
            }
        }
        ],
    // recipe family: group of recipes that belongs together
        recipeFamily: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'recipeFamily'
        }
    })
    ;

// Export the Mongoose model
module.exports = mongoose.model('Recipe', Recipe);