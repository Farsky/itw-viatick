const db = require('../models');
const Location = db.exits;
const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
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

// Retrieve all Tutorials from the database.
exports.readActive = (req, res) => {
    Location.findAll({ where: { isDisabled: false } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving locations.'
            });
        });
};

// Retrieve all Tutorials from the database.
exports.read = (req, res) => {
    Location.findAll({ where: { locationId: req.params.id } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error retrieving Tutorial with id=' + id
            });
        });
};

// Create and Save a new Location
exports.create = (req, res) => {
    // Validate request
    if (!req.body.locationId) {
        res.status(400).send({
            message: 'LocationId cannot be empty!'
        });
        return;
    }

    // Create a Location
    const location = {
        locationId: req.body.locationId,
        isOnFire: false,
    };

    // Save Location in the database
    Tutorial.create(location)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Location.'
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    const isOnFire = req.params.isOnFire;

    Tutorial
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

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial
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