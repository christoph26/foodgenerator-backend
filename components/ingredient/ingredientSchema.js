// Load required packages
var mongoose = require('mongoose');

// Define our ingredient schema
var Ingredient   = new mongoose.Schema({
    title: String, //name of the ingredient
    //in which supermarket is this ingredient available
    supermarket:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supermarket'}],
    picture: String
});

// Export the Mongoose model
module.exports = mongoose.model('Ingredient', Ingredient);