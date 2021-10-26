const db = require('../models');
const Location = db.Location;
const Op = db.Sequelize.Op;

// Retrieve all Locations from the database.
exports.readAll = (req, res) => {
    Location.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving locations.'
            });
        });
};

// Retrieve all Locations from the database.
exports.readActive = (req, res) => {
    Location.findAll({ where: { isOnFire: false } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving locations.'
            });
        });
};

// Create and Save a new Location
exports.create = (req, res) => {
    // Validate request
    if (!req.body.locationId) {
        res.status(400).send({
            message: 'locationId cannot be empty!'
        });
        return;
    }

    // Create a Location
    const location = {
        'locationId': req.body.locationId,
        'isOnFire': false,
    };

    // Save Location in the database
    Location.create(location)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Location.'
            });
        });
};

// Update a Location by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    const isOnFire = req.params.isOnFire === 'true';

    Location
        .findByPk(id)
        .then(location => {
            if (location === null) {
                res.status(400).send({
                    message: 'Error updating Location with id=' + id
                });
            } else {
                location
                    .update({
                        isOnFire: isOnFire,
                    })
                    .then(() => {
                        res.send({
                            message: 'Location was updated successfully.'
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: 'Error updating Location with id=' + id
                        });
                    });
            }
        });
};

// Delete a Location with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Location
        .destroy({
            where: { locationId: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Location was deleted successfully!'
                });
            } else {
                res.send({
                    message: `Cannot delete Location with id=${id}. Maybe Location was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete Location with id=' + id
            });
        });
};