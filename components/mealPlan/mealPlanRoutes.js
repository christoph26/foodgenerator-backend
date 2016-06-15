module.exports = mealPlanRoutes;

function mealPlanRoutes() {

    var mealPlanController = require('./mealPlanController');
    var router = require('express').Router();

    router.route('/mealPlans/')
        .post(mealPlanController.createMealPlan);

    router.route('/mealPlans/:id')
        .get(mealPlanController.getMealPlan);

    router.route('/mealPlans/')
        .put(mealPlanController.updateMealPlan);

    router.route('/mealPlans/:id')
        .delete(mealPlanController.deleteMealPlan);
    return router;

}