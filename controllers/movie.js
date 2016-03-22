var Movie = require('../models/movie');

exports.postMovie = function(req, res) {

    var movie = new Movie(req.body.Movie);


    movie.save(function(err, m) {
        if (err)
            res.send(err);

        res.json({ message: 'Movie added to the collection!', Movie: m });
    });
};

// Create endpoint /api/movies for GET
exports.getMovies = function(req, res) {
    // Use the Beer model to find all beer
    Movie.find(function(err, movies) {
        if (err)
            res.send(err);

        res.json(movies);
    });
};


// Create endpoint /api/movies/:movie_id for GET
exports.getMovie = function(req, res) {
    // Use the Beer model to find a specific beer
    Movie.findById(req.params.movie_id, function(err, movie) {
        if (err)
            res.send(err);

        res.json({Movie:movie});
    });
};

// Create endpoint /api/movies/:movie_id for PUT
exports.putMovie = function(req, res) {
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

            res.json({Movie: movie});
        });
    });
};

// Create endpoint /api/movies/:movie_id for DELETE
exports.deleteMovie = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Movie.findByIdAndRemove(req.params.movie_id, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Movie removed from the collection!' });
    });
};