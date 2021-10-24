'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Exits', [{
            exitId: 'exit-1',
            name: 'Exit 1',
            x: 960,
            y: 1100,
            adjacentLocationIds: '5f9ac865dc2bb23215000001,5f9ac857dc2bb23215000000',
            isDisabled: false
        }, {
            exitId: 'exit-2',
            name: 'Exit 2',
            x: 1380,
            y: 1224,
            adjacentLocationIds: '5f9ac865dc2bb23215000001',
            isDisabled: false
        }, {
            exitId: 'exit-3',
            name: 'Exit 3',
            x: 2384,
            y: 1368,
            adjacentLocationIds: '5f9ac880dc2bb23215000003',
            isDisabled: false
        }, {
            exitId: 'exit-4',
            name: 'Exit 4',
            x: 3168,
            y: 1584,
            adjacentLocationIds: '5f9ac880dc2bb23215000003',
            isDisabled: false
        }], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Exits', null, {});
    }
};
