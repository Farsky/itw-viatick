'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Exit', [{
            name: 'Exit 1',
            x: 960,
            y: 1100,
            adjacentLocationIds: '5f9ac865dc2bb23215000001,5f9ac857dc2bb23215000000',
            isDisabled: false
        }, {
            name: 'Exit 2',
            x: 1380,
            y: 1224,
            adjacentLocationIds: '5f9ac865dc2bb23215000001',
            isDisabled: false
        }, {
            name: 'Exit 3',
            x: 2384,
            y: 1368,
            adjacentLocationIds: '5f9ac880dc2bb23215000003',
            isDisabled: false
        }, {
            name: 'Exit 4',
            x: 3168,
            y: 1584,
            adjacentLocationIds: '5f9ac880dc2bb23215000003',
            isDisabled: false
        }], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Exit', null, {});
    }
};
