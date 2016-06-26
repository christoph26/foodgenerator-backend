var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//define our user schema
var userSchema = mongoose.Schema({
    //email for login
    email: {
        type: String,
        required: true,
        unique: true
    },
    //pw for login
    password: {
        type: String,
        required: true
    },
    //name of the user (optional)   //TODO why is this optional when in the web service it is not?
    firstName: String,
    lastName: String
});

userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


var User = mongoose.model('User', userSchema);

module.exports = User;