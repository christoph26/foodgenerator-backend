// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var IngredientList   = new mongoose.Schema({
    amount: [{String}],
    Ingredients: [{type: mongoose.Schema.Type.ObjectId,
		  ref:'ingredient'}]
});

// Export the Mongoose model
module.exports = mongoose.model('IngredientList', ingredientListSchema);