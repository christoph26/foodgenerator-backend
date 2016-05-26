// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Supermarket   = new mongoose.Schema({
    titel: String,
    icon: String,
    products: [{type: mongoose.Schema.Type.ObjectId,
		  ref:'ingredient'}]
});

// Export the Mongoose model
module.exports = mongoose.model('Supermarket', supermarketSchema);