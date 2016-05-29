module.exports = ingredientRoutes;

function ingredientRoutes() {

    var ingredientController = require('./ingredientController');
    var router = require('express').Router();

    router.route('/ingredient/:id')
        .get(ingredientController.getIngredient)
    return router;

}