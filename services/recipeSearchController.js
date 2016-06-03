var Recipe = require('../components/recipe/recipeSchema');
var RecipeFamily = require('../components/recipeFamily/recipeFamilySchema');

/*
 expected body structure:
 {
 searchtext: nonempty String, required
 useParameter: boolean, required
 vegetarian: boolean, default false
 vegan: boolean, default false
 }
 */
exports.searchRecipes = function (req, res) {

    if (!req.body.searchtext || req.body.searchtext == "") {
        res.status(400).send('Search text required.');
        return;
    }
    if (typeof req.body.userParameter === 'undefined') {
        res.status(400).send("Attribute 'userParameter' required");
        return;
    }

    var textquery = {
        '$text': {
            '$search': req.body.searchtext
        }
    };


    if (req.body.userParameter) {

        var query = Recipe.find({$text: {$search: req.body.searchtext}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}});

        if (typeof req.body.vegetarian !== 'undefined') {
            query.where("vegetarian", req.body.vegetarian);
        }

        if (typeof req.body.vegan !== 'undefined') {
            query.where("vegan", req.body.vegan);
        }

        query.exec(function (queryError, queryResult) {
            if (queryError) {
                res.status(500).send(queryError)
                return;
            }
            ;
            res.json(queryResult);
        });


    } else {
        var query = RecipeFamily.find({'$text': {'$search': req.body.searchtext}});

        query.exec(function (queryError, queryResult) {
            if (queryError) {
                res.status(500).send(queryError)
                return;
            }
            ;

            res.json(queryResult);
        });

    }

};
