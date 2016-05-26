// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var MealList   = new mongoose.Schema({
    titel: String,
    order: String,
    recipe:[{type: mongoose.Schema.Type.ObjectId,
		  ref:'meal'}
           ]
});

// Export the Mongoose model
module.exports = mongoose.model('MealList', mealListSchema);