const db = require('../models');
const Exit = db.Exit;
const Op = db.Sequelize.Op;

// Retrieve all Exits from the database.
exports.readAll = (req, res) => {
    Exit.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving exits.'
            });
        });
};

// Retrieve all Exits from the database.
exports.readActive = (req, res) => {
    Exit.findAll({ where: { isDisabled: false } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving exits.'
            });
        });
};

// Update a Exit by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    const isActive = req.params.isActive === 'true';

    Exit
        .findByPk(id)
        .then(exit => {
            if (exit === null) {
                res.status(400).send({
                    message: 'Error updating Location with id=' + id
                });
            } else {
                exit
                    .update({
                        isDisabled: !isActive,
                    })
                    .then(() => {
                        res.send({
                            message: 'Exit was updated successfully.'
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: 'Error updating Exit with id=' + id
                        });
                    });
            }
        });
};