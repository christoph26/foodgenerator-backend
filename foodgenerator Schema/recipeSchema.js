// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Recipe = new mongoose.Schema({
        title: String,
        skill: Number,
        description: String,
        vegan: Boolean,
        vegetarian: Boolean,
        ingredientlist: {
            amount: [String],
            ingredient: [{
                type: mongoose.Schema.Type.ObjectId,
                ref: 'ingredient'
            }]
        },
        recipeFamily: {
            type: mongoose.Schema.Type.ObjectId,
            ref: 'recipeFamily'
        }
    })
;

// Export the Mongoose model
module.exports = mongoose.model('Recipe', recipeSchema);