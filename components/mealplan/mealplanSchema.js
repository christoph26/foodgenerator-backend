// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Mealplan = new mongoose.Schema({
    titel: String,
    mealList: {
        titel: String,
        order: Number,
        meal: {
            order: String,
            recipe: {
                type: mongoose.Schema.Type.ObjectId,
                ref: 'recipe'
            }
        }
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Mealplan', mealPlanSchema);