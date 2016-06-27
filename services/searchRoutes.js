module.exports = searchRoutes;

function searchRoutes() {

    var recipeSearchController = require('./recipeSearchController');
    var router = require('express').Router();

    router.post('/recipesearch', recipeSearchController.searchRecipes);
    router.post('/ingredientsearch', recipeSearchController.searchIngredients);
    return router;

}