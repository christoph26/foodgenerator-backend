// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var RecipeFamily   = new mongoose.Schema({
    defaultrecipe: {
        type: mongoose.Schema.Types.ObjectId,
		  ref:'recipe'}
});


// Export the Mongoose model
module.exports = mongoose.model('RecipeFamily', RecipeFamily);