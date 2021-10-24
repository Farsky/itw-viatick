module.exports = app => {
    const locations = require('../controllers/location.controller.js');

    var router = require('express').Router();

    // Retrieve all Locations
    router.get('/', locations.readAll);

    // Retrieve all active Locations
    router.get('/active', locations.readActive);

    // Register a Location (this location will be able to have an escape route)
    router.post('/', locations.create);

    // Toggle fire warning on a Location
    router.put('/:id/:isOnFire', locations.update);

    // Delete a Location
    router.delete('/:id', locations.delete);

    app.use('/api/locations', router);
};