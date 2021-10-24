'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Exit', {
            exitId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            x: {
                type: Sequelize.DECIMAL
            },
            y: {
                type: Sequelize.DECIMAL
            },
            adjacentLocationIds: {
                type: Sequelize.STRING
            },
            isDisabled: {
                type: Sequelize.BOOLEAN
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Exit');
    }
};