var MealPlan = require('./mealPlanSchema');
var base = require('../base');

// Create endpoint /users/:id for GET
exports.getMealPlan = function (req, res) {
    MealPlan.findById(req.params.id).lean().exec(function (err, result) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result) {
            // if the given ID returned an entry, verify the user authorisation
            var idFromToken = base.getIdFromToken(req.headers['authorization'].split(" ")[1]);
            if (!idFromToken || !(idFromToken.user._id == result.user)) {
                res.status(403).send('Unauthorized!');
                return;
            }
        }

        res.json(result);
    });
};

module.exports.createMealPlan = function (req, res) {
    var body = req.body;

    //Check authorisation
    var idFromToken = base.getIdFromToken(req.headers['authorization'].split(" ")[1]);
    if (!idFromToken || !(idFromToken.user._id === body.user)) {
        res.status(403).send('Unauthorized.!');
        return;
    }

    //check for pw and email
    if (!body.title || !(body.title.length > 0)) {
        res.status(400).send('Title required');
        return;
    }
    if (!body.mealLists) {
        res.status(400).send('MealLists required');
        return;
    }

    var mealPlan = new MealPlan();
    mealPlan.title = body.title;
    mealPlan.mealLists = body.mealLists;
    mealPlan.user = body.user;

    mealPlan.save(function (err, savedMealPlan) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(200).json(savedMealPlan);
    });
};

module.exports.updateMealPlan = function (req, res) {
    var body = req.body;

    //Check authorisation
    var idFromToken = base.getIdFromToken(req.headers['authorization'].split(" ")[1]);
    if (!idFromToken || !(idFromToken.user._id === body.user)) {
        res.status(403).send('Unauthorized!');
        return;
    }

    if (!body._id) {
        res.status(400).send('_id required.');
        return;
    }

    MealPlan.findOneAndUpdate({_id: body._id}, req.body, function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(200).json("Update successful!");
    });
};

module.exports.deleteMealPlan = function (req, res) {

    //Check authorisation
    MealPlan.findById(req.params.id).lean().exec(function (err, result) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result) {
            var idFromToken = base.getIdFromToken(req.headers['authorization'].split(" ")[1]);
            if (!idFromToken || !(idFromToken.user._id == result.user)) {
                res.status(403).send('Unauthorized!');
                return;
            }

            //Delete MealPlan
            MealPlan.findOneAndRemove({_id: req.params.id}, function (err) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.status(200).json("Deleted MealPlan with ID " + req.params.id + ".");
            });
        } else {
            res.status(500).send("ID does not exist.");


        }
    });


};
