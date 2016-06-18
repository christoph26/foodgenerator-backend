module.exports = mealPlanRoutes;

function mealPlanRoutes(passport) {

    var mealPlanController = require('./mealPlanController');
    var router = require('express').Router();

    router.route('/mealPlans/')
        .post(passport.authenticate('jwt', {session: false}), mealPlanController.createMealPlan);

    router.route('/mealPlans/:id')
        .get(passport.authenticate('jwt', {session: false}), mealPlanController.getMealPlan);

    router.route('/mealPlans/')
        .put(passport.authenticate('jwt', {session: false}), mealPlanController.updateMealPlan);

    router.route('/mealPlans/:id')
        .delete(passport.authenticate('jwt', {session: false}), mealPlanController.deleteMealPlan);
    return router;

}