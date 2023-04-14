'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(
      options,
      [
        {
          eventId: 1,
          userId: 1,
          status: 'waitlist'
        },
        {
          eventId: 2,
          userId: 1,
          status: 'pending'
        },
        {
          eventId: 2,
          userId: 2,
          status: 'waitlist'
        },
        {
          eventId: 3,
          userId: 2,
          status: 'pending'
        },
        {
          eventId: 3,
          userId: 3,
          status: 'attending'
        },
        {
          eventId: 2,
          userId: 3,
          status: 'attending'
        },
        

      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        [Op.or]: [
          { userId: 1, eventId: 1 },
          { userId: 1, eventId: 2 },
          { userId: 2, eventId: 2 },
          { userId: 2, eventId: 3 },
          { userId: 3, eventId: 3 },
          { userId: 3, eventId: 2 }
        ]
      },
      {}
    );
  }
};
