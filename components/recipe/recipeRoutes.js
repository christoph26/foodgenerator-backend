module.exports = recipeRoutes;

function recipeRoutes() {

    var recipeController = require('./recipeController');
    var router = require('express').Router();

    router.route('/recipe/:id')
        .get(recipeController.getRecipe)
    return router;

}