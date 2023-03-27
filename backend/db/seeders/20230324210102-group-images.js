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
        url: "Image-of-basketball-team.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 1,
        url: "Image-of-dunk.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 2,
        url: "Image-of-soccer-team.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 3,
        url: "Image-of-football-team.png",
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
          [Op.in]: ["Image-of-basketball-team.png", "Image-of-dunk.png", "Image-of-soccer-team.png", "Image-of-football-team.png"]
        }
      },
      {}
    );
  }
};
