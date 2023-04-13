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
          name: 'Basketball Daily Games',
          about: 'Hey yall! We are lovers of basketball and host games here at the park every day. Come and join us! Keep an eye out for our updates.',
          type: 'In person',
          private: false,
          city: 'New York',
          state: 'NY'
        },
        {
          organizerId: 2,
          name: 'Soccer Fanatics',
          about: 'We love to play soccer, talk soccer, and simply talk about soccer. If that is you as well, come and join us!',
          type: 'Online',
          private: false,
          city: 'Los Angeles',
          state: 'CA'
        },
        {
          organizerId: 3,
          name: 'Salsa Dancing Club',
          about: 'Do you want to learn how to salsa dance? Come visit for our weekly tuesday events!',
          type: 'In person',
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
        name: { [Op.in]: ['Basketball Daily Games', 'Soccer Fanatics', 'Salsa Dancing Club'] }
      },
      {}
    );
  }
};
