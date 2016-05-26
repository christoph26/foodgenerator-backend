// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var MealPlan   = new mongoose.Schema({
    titel: String,
    recipe:[{type: mongoose.Schema.Type.ObjectId,
		  ref:'mealList'}
           ]
});

// Export the Mongoose model
module.exports = mongoose.model('MealPlan', mealPlanSchema);