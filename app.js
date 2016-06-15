var Config = require('./config/config.js');

/**
 * db connect
 */

var mongoose = require('mongoose');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});

/**
 * create application
 */

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

/**
 * app setup
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//passport

var passport = require('passport');
var jwtConfig = require('./components/passport/jwtConfig');

app.use(passport.initialize());
jwtConfig(passport);


/**
 * routing
 */

var userRoutes = require("./components/user/userRoutes");
app.use('/', userRoutes(passport));

var ingredientRoutes = require("./components/ingredient/ingredientRoutes");
app.use('/', ingredientRoutes());

var ingredientListRoutes = require("./components/ingredientList/ingredientListRoutes");
app.use('/', ingredientListRoutes());

var recipeRoutes = require("./components/recipe/recipeRoutes");
app.use('/', recipeRoutes());

var recipeFamilyRoutes = require("./components/recipeFamily/recipeFamilyRoutes");
app.use('/', recipeFamilyRoutes());

var supermarketRoutes = require("./components/supermarket/supermarketRoutes");
app.use('/', supermarketRoutes());

var mealPlanRoutes = require("./components/mealPlan/mealPlanRoutes");
app.use('/', mealPlanRoutes());

var searchRoutes = require("./services/searchRoutes");
app.use('/search', searchRoutes());

module.exports = app;