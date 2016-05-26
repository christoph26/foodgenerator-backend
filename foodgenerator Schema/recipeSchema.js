// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Recipe   = new mongoose.Schema({
    title: String,
    skill: Integer,
    description: String,
    vegan: Boolean,
    vegetarian: Boolean,
    ingredientlist: [ 
	{type: mongoose.Schema.Type.ObjectId,
	 ref:'ingredientList'}
    ]
    recipeFamily:{type: mongoose.Schema.Type.ObjectId,
		  ref:'recipeFamily'}
});

// Export the Mongoose model
module.exports = mongoose.model('Recipe', recipeSchema);