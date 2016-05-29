var Recipe = require('./recipeSchema');
var base = require('../base');

// Create endpoint /api/recipe/:id for GET
exports.getRecipe = base.getEntityById(Recipe)
