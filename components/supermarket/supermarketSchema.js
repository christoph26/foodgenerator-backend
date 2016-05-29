// Load required packages
var mongoose = require('mongoose');

// Define our Supermarket schema
var Supermarket   = new mongoose.Schema({
    titel: String,
    icon: String
});

// Export the Mongoose model
module.exports = mongoose.model('Supermarket', Supermarket);