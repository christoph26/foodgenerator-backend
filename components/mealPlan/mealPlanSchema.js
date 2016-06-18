// Load required packages
var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');

var Meal = new mongoose.Schema(
    {
        order: {
            type: Number,
            required: true
        }, // to order if its the first or the last meal of the plan
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true
        }
    }
);

var MealList = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    meals: {
        type: [Meal]
    }
});


var MealPlan = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    mealLists: [MealList],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

MealPlan.plugin(idvalidator);


// Export the Mongoose model
module.exports = mongoose.model('MealPlan', MealPlan);