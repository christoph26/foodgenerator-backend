var Supermarket = require('./supermarketSchema');
var base = require('../base');

// Create endpoint /api/supermarket/:id for GET
exports.getSupermarket = base.getEntityById(Supermarket);
