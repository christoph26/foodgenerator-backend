var Ingredient = require('./ingredientSchema');

// Create endpoint /api/movies/:ingredient_id for GET
exports.getIngredient = function (req, res) {
    Ingredient.findById(req.params.ingredient_id, function (err, ingredient) {
        if (err) {
            res.status(500).send(err)
            return;
        }
        ;

        res.json(ingredient);
    });
};
