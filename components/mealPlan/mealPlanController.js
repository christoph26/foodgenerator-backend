var MealPlan = require('./mealPlanSchema');
var base = require('../base');

// Create endpoint /users/:id for GET
exports.getMealPlan = base.getEntityById(MealPlan);

module.exports.createMealPlan = function (req, res) {
    var body = req.body;
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
    MealPlan.findOneAndRemove({_id: req.params.id}, function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(200).json("Deleted MealPlan with ID " + req.params.id + ".");
    });
};