module.exports = recipeRoutes;

function recipeRoutes() {

    var recipeController = require('./recipeController');
    var router = require('express').Router();

    router.route('/recipes/:id')
        .get(recipeController.getRecipe);

    router.route('/recipes/recipeFamily/:id')
            .get(recipeController.getOtherRecipesOfFamily);
    return router;

}