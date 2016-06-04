module.exports = recipeFamilyRoutes;

function recipeFamilyRoutes() {

    var recipeFamilyController = require('./recipeFamilyController');
    var router = require('express').Router();

    router.route('/recipeFamilies/:id')
        .get(recipeFamilyController.getRecipeFamily);
    return router;

}