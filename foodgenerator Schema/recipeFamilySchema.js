// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var RecipeFamily   = new mongoose.Schema({
    defaultrecipe: {type: mongoose.Schema.Type.ObjectId,
		  ref:'recipe'}
    recipes: [{type: mongoose.Schema.Type.ObjectId,
		  ref:'recipe'}]
});


RecipeFamily.methods.getDefaultRecipe = function (){
	return this.defaultrecipe;
}
RecipeFamily.methods.getFamilyRecipes = function (){
	return this.recipes;
}

// Export the Mongoose model
module.exports = mongoose.model('RecipeFamily', recipeFamilySchema);