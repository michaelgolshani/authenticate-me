'use strict';

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "Image of basketball team",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 1,
        url: "Image of dunk",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 2,
        url: "Image of soccer team",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 3,
        url: "Image of football team",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      {
        url: {
          [Op.in]: ["Image of basketball team", "Image of dunk", "Image of soccer team", "Image of football team"]
        }
      },
      {}
    );
  }
};
