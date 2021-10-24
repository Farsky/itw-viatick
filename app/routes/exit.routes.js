module.exports = app => {
    const exits = require('../controllers/exit.controller.js');

    var router = require('express').Router();

    // Retrieve all Exits
    router.get('/', exits.readAll);

    // Retrieve all active Exits
    router.get('/active', exits.readActive);

    // Enable/disable an Exit with id
    router.put('/:id/:isEnabled', exits.update);

    app.use('/api/exits', router);
};