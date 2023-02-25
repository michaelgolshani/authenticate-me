'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(
      options,
      [
        {
          venueId: 1,
          groupId: 1,
          name: 'Event 1',
          description: 'This is event 1',
          type: 'Online',
          capacity: 50,
          price: 20,
          startDate: new Date('2023-03-01T12:00:00Z'),
          endDate: new Date('2023-03-01T14:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          venueId: 2,
          groupId: 2,
          name: 'Event 2',
          description: 'This is event 2',
          type: 'In Person',
          capacity: 100,
          price: 10,
          startDate: new Date('2023-03-02T18:00:00Z'),
          endDate: new Date('2023-03-02T20:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          venueId: 3,
          groupId: 3,
          name: 'Event 3',
          description: 'This is event 3',
          type: 'In Person',
          capacity: 30,
          price: 15,
          startDate: new Date('2023-03-03T15:00:00Z'),
          endDate: new Date('2023-03-03T17:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ['Event 1', 'Event 2', 'Event 3'] }
      },
      {}
    );
  }
};
