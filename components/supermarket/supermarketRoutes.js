module.exports = supermarketRoutes;

function supermarketRoutes() {

    var supermarketController = require('./supermarketController');
    var router = require('express').Router();

    router.route('/supermarket/:id')
        .get(supermarketController.getSupermarket);
    router.route('/supermarkets')
        .get(supermarketController.getAllSupermarkets);
    return router;

}