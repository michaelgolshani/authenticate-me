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
          name: '3 Vs 3 Basketball Tourney',
          description: 'Ready for a 3 vs 3 battle? Bring out your buddies and lets see who can win this tournament!',
          type: 'In person',
          capacity: 50,
          price: 20,
          private: true,
          startDate: new Date('2023-06-01T12:00:00Z'),
          endDate: new Date('2023-06-01T14:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          venueId: 2,
          groupId: 2,
          name: 'FIFA Live Tournament',
          description: 'We are going to be talking and having FIFA buy ins on Twitch. We would love to see what you got!',
          type: 'Online',
          capacity: 100,
          price: 10,
          private: false,
          startDate: new Date('2023-03-02T18:00:00Z'),
          endDate: new Date('2023-03-02T20:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          venueId: 3,
          groupId: 3,
          name: 'Salsa Time!',
          description: 'Our first event will be starting on Tuesday. Come and learn how to salsa dance. You might get an attractive partner! ;)',
          type: 'In person',
          capacity: 30,
          price: 15,
          private: false,
          startDate: new Date('2023-06-03T15:00:00Z'),
          endDate: new Date('2023-06-03T17:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          venueId: 1,
          groupId: 1,
          name: 'Basketball Scrimmage',
          description: 'Join us for a casual basketball scrimmage at the park. All skill levels are welcome!',
          type: 'In person',
          capacity: 20,
          price: 0,
          private: false,
          startDate: new Date('2023-06-03T14:00:00Z'),
          endDate: new Date('2023-06-03T16:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          venueId: 1,
          groupId: 1,
          name: '3-Point Shootout',
          description: 'Test your shooting skills in our 3-point shootout contest. Bring your A-game and compete for the title of the best shooter!',
          type: 'In person',
          capacity: 20,
          price: 5,
          private:false,
          startDate: new Date('2023-02-15T10:00:00Z'),
          endDate: new Date('2023-02-15T12:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
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
        name: { [Op.in]: ['3 Vs 3 Basketball Tourney', 'Basketball Scrimmage', '3-Point Shootout', 'FIFA Live Tournament', 'Salsa Time!'] }
      },
      {});
  }
};
