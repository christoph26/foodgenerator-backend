module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();


    router.post('/login', userController.login);//needs email and pw
    router.post('/signup', userController.signup); //needs email, pw, first and last name
    router.post('/unregister', passport.authenticate('jwt', {session: false}), userController.unregister);

    return router;

}