// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Movie   = new mongoose.Schema({
    title: String,
    description: String,
    mpaa_rating: String,
    year: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Movie', Movie);