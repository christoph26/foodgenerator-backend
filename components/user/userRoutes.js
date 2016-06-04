module.exports = userRoutes;


//function userRoutes(passport) {
function userRoutes() {

    var userController = require('./userController');
    var router = require('express').Router();

    router.route('/users/:id')
        .get(userController.getUser);

    router.post('/login', userController.login);//needs email and pw
    router.post('/signup', userController.signup); //needs email, pw, first and last name
    router.post('/unregister', userController.unregister); //needs email and pw

    return router;

}