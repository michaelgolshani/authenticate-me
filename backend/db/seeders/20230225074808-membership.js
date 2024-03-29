'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          groupId: 1,
          status: 'co-host'
        },
        {
          userId: 1,
          groupId: 2,
          status: 'pending'
        },
        {
          userId: 2,
          groupId: 1,
          status: 'co-host'
        },
        {
          userId: 2,
          groupId: 2,
          status: 'co-host'
        },
        {
          userId: 3,
          groupId: 3,
          status: 'co-host'
        },
        {
          userId: 3,
          groupId: 2,
          status: 'member'
        },
        {
          userId: 3,
          groupId: 1,
          status: 'pending'
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        [Op.or]: [
          { userId: 1, groupId: 1 },
          { userId: 1, groupId: 2 },
          { userId: 2, groupId: 1 },
          { userId: 2, groupId: 2 },
          { userId: 3, groupId: 3 },
          { userId: 3, groupId: 2 },
          { userId: 3, groupId: 1 }
        ]
      },
      {}
    );
  }
};
