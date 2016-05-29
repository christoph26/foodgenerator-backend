module.exports = recipeFamilyRoutes;

function recipeFamilyRoutes() {

    var recipeFamilyController = require('./recipeFamilyController');
    var router = require('express').Router();

    router.route('/recipeFamily/:id')
        .get(recipeFamilyController.getRecipeFamily);
    return router;

}