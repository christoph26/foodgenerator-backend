var Movie = require('./movieSchema');

exports.postMovie = function(req, res) {

    var movie = new Movie(req.body);


    movie.save(function(err, m) {
        if (err)
            res.send(err);

        res.json(m);
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

        res.json(movie);
    });
};

// Create endpoint /api/movies/:movie_id for PUT
exports.putMovie = function(req, res) {
    // Use the Beer model to find a specific beer
    Movie.findByIdAndUpdate(
        req.params.movie_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, movie) {
        if (err) {
            return null;
        }
        res.json(movie);
    });

};

// Create endpoint /api/movies/:movie_id for DELETE
exports.deleteMovie = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Movie.findByIdAndRemove(req.params.movie_id, function(err) {
        if (err)
            res.send(err);

        res.json();
    });
};