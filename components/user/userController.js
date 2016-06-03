var Config = require('../../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');

module.exports.login = function(req, res){
//check for pw and email
    if (!req.body.email) {
        res.status(400).send('username required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }
//search user by email
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            res.status(500).send(err);
            return
        }
//if no user found, return
        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        //check for right pw
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                //if right: creates token
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};

module.exports.signup = function(req, res){
    //check for required information
    if(!req.body.email){
        res.status(400).send('email required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }
    if(!req.body.firstName){
        res.status(400).send('first name required');
        return;
    }
    if(!req.body.lastName){
        res.status(400).send('last name required');
        return;
    }
//create new user, insert information
    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.salt = "salzig";

//safe user in db
    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
//creates token
        res.status(201).json({token: createToken(user)});
    });
};

//deletes an user
module.exports.unregister = function(req, res) {
//check fpr emaila nd pw
    if (!req.body.email) {
        res.status(400).send('username required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }
//search for email in db
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        //check if right pw
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                //if right pw, delete user
                user.remove();
                res.status(400).send('user deleted');
            }
        });
    });



};



function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            username: user.username
        }

    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
}