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