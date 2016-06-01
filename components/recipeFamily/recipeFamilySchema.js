// Load required packages
var mongoose = require('mongoose');

// Define our RecipeFamily schema
var RecipeFamily = new mongoose.Schema({
    //the default recipe for this recipe family
    defaultRecipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }
});


// Export the Mongoose model
module.exports = mongoose.model('RecipeFamily', RecipeFamily);