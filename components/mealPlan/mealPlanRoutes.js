module.exports = mealPlanRoutes;

function mealPlanRoutes() {

    var mealPlanController = require('./mealPlanController');
    var router = require('express').Router();

    //router.route('/recipes/:id')
    //    .get(mealPlanController.getMealplan);

    router.route('/mealPlans/')
        .post(mealPlanController.createMealPlan);
    return router;

}