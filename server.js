// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Movie = require('./models/movie');
var movieController = require('./controllers/movie');

// Connect to the MongoDB with movies
mongoose.connect('mongodb://localhost:27017/moviedb');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
    res.json({ message: 'You are running dangerously low on beer!' });
});

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert beer on port ' + port);

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
    res.json({ message: 'You are running dangerously low on beer!' });
});

// -- New Code Below Here -- //

// Create a new route with the prefix /movies
router.route('/movies')
    .post(movieController.postMovie)
    .get(movieController.getMovies);

router.route('/movies/:movie_id')
    .get(movieController.getMovie)
    .put(movieController.putMovie)
    .delete(movieController.deleteMovie);