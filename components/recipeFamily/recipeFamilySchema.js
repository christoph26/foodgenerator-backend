// Load required packages
var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

// Define our RecipeFamily schema
var RecipeFamily = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    //the default recipe for this recipe family
    defaultrecipe: {
        type: mongoose.Schema.ObjectId,
        //ref: 'Recipe',
        required: true
    }
});
RecipeFamily.plugin(idvalidator);

// Export the Mongoose model
module.exports = mongoose.model('RecipeFamily', RecipeFamily);