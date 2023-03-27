'use strict';

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: "Image of basketball court",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 1,
        url: "Image of scoreboard",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 2,
        url: "Image of soccer field",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 2,
        url: "Image of soccer bleachers",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 3,
        url: "Image of football field",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      {
        url: {
          [Op.in]: ["Image of basketball court", "Image of scoreboard", "Image of soccer field","Image of soccer bleachers", "Image of football field"]
        }
      },
      {}
    );
  }
};
