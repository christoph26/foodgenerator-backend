/**
 * Basis implementation of a GET request. A entity defined by its id is loaded from the database and returned.
 *
 * @param schema  Schema of the entity
 * @returns getFunction for the controller of a specific component
 */
exports.getEntityById = function getEntityById(schema) {
    var getFunction = function (req, res) {
        schema.findById(req.params.id, function (err, ingredient) {
            if (err) {
                res.status(500).send(err)
                return;
            }
            ;

            res.json(ingredient);
        });
    }

    return getFunction
}

