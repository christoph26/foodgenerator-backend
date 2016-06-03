var IngredientList = require('./ingredientListSchema');
var base = require('../base');

// Create endpoint /api/movies/:id for GET
exports.getIngredientList = base.getEntityById(IngredientList)
