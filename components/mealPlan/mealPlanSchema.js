// Load required packages
var mongoose = require('mongoose');

// Define our MealPlan schema
var MealPlan = new mongoose.Schema({
    titel: String, //name for the Plan (eg. Tina's visit, weekend, my favourite meals,...)
    //one MealPlan can has multiple meal Lists (eg. plan for multiple days)
    mealList: [{
        titel: String, //name for the List (eg. Monday)
        order: Number, // to order the different "days"
        //each mealList can has multiple meals (eg. breakfast, lunch, dinner)
        meal: [{
            order: String, // to order if its the first or the last meal of the plan
            recipe: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'recipe'
            }
        }]
    }]
});

// Export the Mongoose model
module.exports = mongoose.model('MealPlan', mealPlan);