// Load required packages
var mongoose = require('mongoose');

// Define our Supermarket schema
var Supermarket   = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Supermarket', Supermarket);