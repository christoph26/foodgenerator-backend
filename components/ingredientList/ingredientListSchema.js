// Load required packages
var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

// Define our ingredient schema
var IngredientList = new mongoose.Schema({
    ingredients: {
        type: [{
            amount: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            ingredient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ingredient',
                required: true

            }
        }
        ],
        required: true
    }
});
IngredientList.plugin(idvalidator);

// Export the Mongoose model
module.exports = mongoose.model('IngredientList', IngredientList);



