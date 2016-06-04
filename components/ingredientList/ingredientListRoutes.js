module.exports = ingredientListRoutes;

function ingredientListRoutes() {

    var ingredientListController = require('./ingredientListController');
    var router = require('express').Router();

    router.route('/ingredientLists/:id')
        .get(ingredientListController.getIngredientList);
    return router;

}