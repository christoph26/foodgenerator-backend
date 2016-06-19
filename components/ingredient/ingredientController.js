var Ingredient = require('./ingredientSchema');
var base = require('../base');

exports.getIngredient = base.getEntityById(Ingredient)

exports.findIngredientAutocomplete = function (req, res) {
    var searchTerm = req.body.searchTerm;
    var regex = new RegExp(searchTerm, 'i');

    Ingredient.find({title: regex}).select("title _id").lean().exec(function (err, result) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        for (var i = 0; i < result.length; i++) {
            result[i].text = result[i].title;
        }
        res.json(result);
    });


}