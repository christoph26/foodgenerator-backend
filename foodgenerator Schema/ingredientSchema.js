// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Ingredient   = new mongoose.Schema({
    title: String,
});

// Export the Mongoose model
module.exports = mongoose.model('Ingredient', ingredientSchema);