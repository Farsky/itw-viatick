module.exports = app => {
    const locations = require('../controllers/location.controller.js');

    var router = require('express').Router();

    // Retrieve all Locations
    router.get('/', locations.readAll);

    // Retrieve all active Locations
    router.get('/active', locations.readActive);

    // Create a new Location
    router.post('/', locations.create);

    // Toggle fire warning on a Location with id
    router.put('/:id/:isOnFire', locations.update);

    // Delete a Location with id
    router.delete('/:id', locations.delete);

    app.use('/api/locations', router);
};