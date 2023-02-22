'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(
      options,
      [
        {
          organizerId: 1,
          name: 'Group 1',
          about: 'This is group 1',
          type: 'pending',
          private: true,
          city: 'New York',
          state: 'NY'
        },
        {
          organizerId: 2,
          name: 'Group 2',
          about: 'This is group 2',
          type: 'active',
          private: false,
          city: 'Los Angeles',
          state: 'CA'
        },
        {
          organizerId: 3,
          name: 'Group 3',
          about: 'This is group 3',
          type: 'disabled',
          private: true,
          city: 'Chicago',
          state: 'IL'
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ['Group 1', 'Group 2', 'Group 3'] }
      },
      {}
    );
  }
};
