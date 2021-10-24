'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Location', {
            locationId: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            isOnFire: {
                type: Sequelize.BOOLEAN
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Location');
    }
};