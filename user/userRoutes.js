var userController = require('./userController');
var router = require('express').Router();


router.post('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;