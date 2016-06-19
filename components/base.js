var jwt = require('jwt-simple');
var Config = require('../config/config.js');

/**
 * Basis implementation of a GET request. A entity defined by its id is loaded from the database and returned.
 *
 * @param schema  Schema of the entity
 * @returns getFunction for the controller of a specific component
 */
exports.getEntityById = function getEntityById(schema) {
    var getFunction = function (req, res) {
        schema.findById(req.params.id, function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(result);
        });
    };

    return getFunction
};

/**
 * Basis implementation of a GET ALL request. All entities defined by their schema are loaded from the database and returned.
 *
 * @param schema  Schema of the entity
 * @returns getAllFunction for the controller of a specific component
 */
exports.getAllEntities = function getAllEntities(schema) {
    var getAllFunction = function (req, res) {
        schema.find(function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(result);
        });
    };

    return getAllFunction
};

exports.getIdFromToken = function getIdFromToken(token) {
    var decoded = jwt.decode(token, Config.auth.jwtSecret);
    return decoded;
};