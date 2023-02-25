'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}



module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(
      options,
      [
      {
        groupId: 1,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        lat: 40.7128,
        lng: -74.0060,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        groupId: 2,
        address: '456 Broadway',
        city: 'Los Angeles',
        state: 'CA',
        lat: 34.0522,
        lng: -118.2437,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        groupId: 3,
        address: '789 Michigan Ave',
        city: 'Chicago',
        state: 'IL',
        lat: 41.8781,
        lng: -87.6298,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      {
        groupId: { [Op.in]: [1, 2, 3] }
      },
      {});
  }
};
