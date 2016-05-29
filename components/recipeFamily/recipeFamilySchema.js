// Load required packages
var mongoose = require('mongoose');

// Define our RecipeFamily schema
var RecipeFamily   = new mongoose.Schema({
    //the default recipe for this recipe family
    defaultrecipe: {
        type: mongoose.Schema.Types.ObjectId,
		  ref:'recipe'}
});


// Export the Mongoose model
module.exports = mongoose.model('RecipeFamily', RecipeFamily);