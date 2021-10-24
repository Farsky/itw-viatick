'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Exits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      exitId: {
        type: Sequelize.STRING
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Exits');
  }
};