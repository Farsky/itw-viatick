'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Locations', [
            { locationId: '5f9ac59cdc2bb20e9b000058', isOnFire: false, },
            { locationId: '5f9ac5acdc2bb20e9b000059', isOnFire: false, },
            { locationId: '5f9ac5b0dc2bb20e9b00005a', isOnFire: false, },
            { locationId: '5f9ac5b4dc2bb20e9b00005b', isOnFire: false, },
            { locationId: '5f9ac5bbdc2bb20e9b00005c', isOnFire: false, },
            { locationId: '5f9ac5c1dc2bb20e9b00005d', isOnFire: false, },
            { locationId: '5f9ac5c5dc2bb20e9b00005e', isOnFire: false, },
            { locationId: '5f9ac5c9dc2bb20e9b00005f', isOnFire: false, },
            { locationId: '5f9ac5cfdc2bb20e9b000060', isOnFire: false, },
            { locationId: '5f9ac6bedc2bb20e9b000061', isOnFire: false, },
            { locationId: '5f9ac6c5dc2bb20e9b000062', isOnFire: false, },
            { locationId: '5f9ac6cedc2bb20e9b000063', isOnFire: false, },
            { locationId: '5f9ac6d4dc2bb20e9b000064', isOnFire: false, },
            { locationId: '5f9ac764dc2bb225de000000', isOnFire: false, },
            { locationId: '5f9ac76ddc2bb225de000001', isOnFire: false, },
            { locationId: '5f9ac775dc2bb225de000002', isOnFire: false, },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Locations', null, {});
    }
};
