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

// Retrieve all Locations from the database.
exports.readOne = (req, res) => {
    const id = req.params.id;

    Location.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Location with id=${id}.`
                });            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || `Error retrieving Location with id=${id}.`
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
        locationId: req.body.locationId,
        isOnFire: false,
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
    const isOnFire = req.params.isOnFire;

    Location
        .update({
            isOnFire: isOnFire,
        }, {
            where: { locationId: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Location was updated successfully.'
                });
            } else {
                res.send({
                    message: `Cannot update Location with id=${id}. Maybe Location was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error updating Location with id=' + id
            });
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