module.exports = recipeRoutes;

function recipeRoutes() {

    var recipeController = require('./recipeController');
    var router = require('express').Router();

    router.route('/recipes/:id')
        .get(recipeController.getRecipe);
    return router;

}