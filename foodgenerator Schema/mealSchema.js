// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Meal   = new mongoose.Schema({
    order: String,
    recipe:{type: mongoose.Schema.Type.ObjectId,
		  ref:'recipe'}
});

// Export the Mongoose model
module.exports = mongoose.model('Meal', mealSchema);