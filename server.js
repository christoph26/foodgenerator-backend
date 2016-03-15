// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Movie = require('./models/movie');
var movieController = require('./controllers/movie');
var cors = require('cors');
var Config = require('./config/config.js');

// Connect to the MongoDB with movies
mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});

// Create our Express application
var app = express();
app.use(cors());
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));


// Create our Express router
var router = express.Router();

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(Config.app.port);
console.log('Insert beer on port ' + Config.app.port);

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
    res.json({ message: 'You are running dangerously low on beer!' });
});

router.route('/movies')
    .post(movieController.postMovie)
    .get(movieController.getMovies);

router.route('/movies/:movie_id')
    .get(movieController.getMovie)
    .put(movieController.putMovie)
    .delete(movieController.deleteMovie);