// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Movie = require('./models/movie');

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
var moviesRoute = router.route('/movies');

// Create endpoint /api/beers for POSTS
moviesRoute.post(function(req, res) {
    // Create a new instance of the Beer model
    var movie = new Movie();

    // Set the beer properties that came from the POST data
    movie.titel = req.body.titel;
    movie.description = req.body.description;
    movie.year = req.body.year;

    // Save the beer and check for errors
    movie.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Movie added to the collection!', data: movie });
    });
});

// Create endpoint /api/movies for GET
moviesRoute.get(function(req, res) {
    // Use the Beer model to find all beer
    Movie.find(function(err, movies) {
        if (err)
            res.send(err);

        res.json(movies);
    });
});

// Create a new route with the /movies/:movie_id prefix
var oneMovieRoute = router.route('/movies/:movie_id');

// Create endpoint /api/movies/:movie_id for GET
oneMovieRoute.get(function(req, res) {
    // Use the Beer model to find a specific beer
    Movie.findById(req.params.movie_id, function(err, movie) {
        if (err)
            res.send(err);

        res.json(movie);
    });
});

// Create endpoint /api/movies/:movie_id for PUT
oneMovieRoute.put(function(req, res) {
    // Use the Beer model to find a specific beer
    Movie.findById(req.params.movie_id, function(err, movie) {
        if (err)
            res.send(err);

        // Update the existing beer quantity
        movie.year = req.body.year;

        // Save the beer and check for errors
        movie.save(function(err) {
            if (err)
                res.send(err);

            res.json(movie);
        });
    });
});

// Create endpoint /api/movies/:movie_id for DELETE
oneMovieRoute.delete(function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Movie.findByIdAndRemove(req.params.movie_id, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Movie removed from the collection!' });
    });
});