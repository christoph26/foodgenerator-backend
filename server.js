
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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


/**
 * routing
 */

var userRoutes = require("./user/userRoutes");
var movieRoutes = require("./movie/movieRoutes");

app.use('/api', movieRoutes);
app.use('/', userRoutes);


/*
 middleware
 */

//var jwt = require('express-jwt');

//app.use(jwt({ secret: Config.auth.secret}).unless({path: ['/login', '/signup']}));


/**
 * Start the server
  */

app.listen(Config.app.port);







