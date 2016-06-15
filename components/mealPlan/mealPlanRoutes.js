module.exports = mealPlanRoutes;

function mealPlanRoutes() {

    var mealPlanController = require('./mealPlanController');
    var router = require('express').Router();

    router.route('/mealPlans/:id')
        .get(mealPlanController.getMealPlan);

    router.route('/mealPlans/')
        .post(mealPlanController.createMealPlan);
    return router;

}