var Config = require('../../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');

module.exports.login = function (req, res) {
    req.on("data", function (body) {
        body = JSON.parse(body.toString());
        //check for pw and email
        if (!body.email) {
            res.status(400).send('username required');
            return;
        }
        if (!body.password) {
            res.status(400).send('password required');
            return;
        }
        //search user by email
        User.findOne({email: body.email}, function (err, user) {
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
            user.comparePassword(body.password, function (err, isMatch) {
                if (!isMatch || err) {
                    res.status(401).send('Invalid Credentials');
                } else {
                    //if right: creates token
                    res.status(200).json({token: createToken(user)});
                }
            });
        });
    });
};

module.exports.signup = function (req, res) {
    req.on("data", function (body) {
        body = JSON.parse(body.toString());
        //check for required information
        if (!body.email) {
            res.status(400).send('email required');
            return;
        }
        if (!body.password) {
            res.status(400).send('password required');
            return;
        }
        if (!body.firstName) {
            res.status(400).send('first name required');
            return;
        }
        if (!body.lastName) {
            res.status(400).send('last name required');
            return;
        }
        //create new user object, insert information
        var user = new User();
        user.email = body.email;
        user.password = body.password;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.salt = "salzig";

        //safe user in db
        user.save(function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            //return user
            res.status(201).json(user);     //FIXME remove password before transmitting user
        });
    });
};

//deletes a user
module.exports.unregister = function (req, res) {
    req.on("data", function (body) {
        body = JSON.parse(body.toString());
        //check for email and pw
        if (!body.email) {
            res.status(400).send('username required');
            return;
        }
        if (!body.password) {
            res.status(400).send('password required');
            return;
        }
        //search for email in db
        User.findOne({email: body.email}, function (err, user) {
            if (err) {
                res.status(500).send(err);
                return
            }

            if (!user) {
                res.status(401).send('Invalid Credentials');
                return;
            }
            //check if right pw
            user.comparePassword(body.password, function (err, isMatch) {
                if (!isMatch || err) {
                    res.status(401).send('Invalid Credentials');
                } else {
                    //if right pw, delete user
                    user.remove();
                    res.status(200).send('user deleted');
                }
            });
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
    return jwt.encode(tokenPayload, Config.auth.jwtSecret);
}
