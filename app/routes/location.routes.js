module.exports = app => {
    const exits = require('../controllers/location.controller.js');

    var router = require('express').Router();

    // Retrieve all Locations
    router.get('/', exits.readAll);

    // Retrieve all active Locations
    router.get('/active', exits.readAll);

    // Enable/disable an Location with id
    router.put('/:id/:isEnabled', exits.update);

    app.use('/api/location', router);
};