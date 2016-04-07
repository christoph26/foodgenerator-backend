var movieController = require('./movieController');
var router = require('express').Router();

router.route('/movies')
    .post(movieController.postMovie)
    .get(movieController.getMovies);

router.route('/movies/:movie_id')
    .get(movieController.getMovie)
    .put(movieController.putMovie)
    .delete(movieController.deleteMovie);

module.exports = router;
