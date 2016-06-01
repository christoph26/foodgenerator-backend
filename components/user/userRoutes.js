module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();


    router.get('/login', userController.login);
    router.post('/signup', userController.signup);
    router.delete('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister)

    return router;

}