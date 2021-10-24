const db = require("./models");
const Exit = db.exits;
const Op = db.Sequelize.Op;

// Retrieve all Tutorials from the database.
exports.readAll = (req, res) => {
    Exit.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving exits."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.readActive = (req, res) => {
    Exit.findAll({ where: { isDisabled: false } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving exits."
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    const isEnabled = req.params.isEnabled;

    Tutorial
        .update({
            isDisabled: !isEnabled,
        }, {
            where: { exitId: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Exit was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Exit with id=${id}. Maybe Exit was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Exit with id=" + id
            });
        });
};