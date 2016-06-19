module.exports = ingredientRoutes;

function ingredientRoutes() {

    var ingredientController = require('./ingredientController');
    var router = require('express').Router();

    router.route('/ingredients/:id')
        .get(ingredientController.getIngredient);

    router.route('/ingredients/')
        .post(ingredientController.findIngredientAutocomplete);
    return router;

}