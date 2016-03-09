// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Movie   = new mongoose.Schema({
    titel: String,
    description: String,
    year: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Movie', Movie);