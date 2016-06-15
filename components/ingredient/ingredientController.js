var Ingredient = require('./ingredientSchema');
var base = require('../base');

// Create endpoint /api/movies/:id for GET
exports.getIngredient = base.getEntityById(Ingredient)
