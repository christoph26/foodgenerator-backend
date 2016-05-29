var RecipeFamily = require('./recipeFamilySchema');
var base = require('../base');

// Create endpoint /api/recipeFamily/:id for GET
exports.getRecipeFamily = base.getEntityById(RecipeFamily);
