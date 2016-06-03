module.exports = searchRoutes;

function recipeSearchRoutes() {

    var recipeSearchController = require('./recipeSearchController');
    var router = require('express').Router();

    router.post('recipesearch', recipeSearchController.searchRecipes);
    return router;

}