// Load required packages
var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

// Define our ingredient schema
var Ingredient = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, //name of the ingredient
    //in which supermarket is this ingredient available
    supermarkets: {
        type: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Supermarket'
        }],
        required: true
    }
});
Ingredient.plugin(idvalidator);

// Export the Mongoose model
module.exports = mongoose.model('Ingredient', Ingredient);