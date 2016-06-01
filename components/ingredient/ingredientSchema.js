// Load required packages
var mongoose = require('mongoose');

// Define our ingredient schema
var Ingredient   = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, //name of the ingredient
    //in which supermarket is this ingredient available
    supermarket:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supermarket'
    }]
});

// Export the Mongoose model
module.exports = mongoose.model('Ingredient', Ingredient);