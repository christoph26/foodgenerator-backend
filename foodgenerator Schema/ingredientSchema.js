// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Ingredient   = new mongoose.Schema({
    title: String,
    supermarket:[String],
    picture: String
});

// Export the Mongoose model
module.exports = mongoose.model('Ingredient', ingredientSchema);