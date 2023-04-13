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
        url: "https://basketballword.com/wp-content/uploads/2019/07/Webp.net-resizeimage.jpg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 1,
        url: "https://t3.ftcdn.net/jpg/02/21/10/40/360_F_221104021_sAMazMUFlHsCLvu1uDlkYdTAHZvQVwEE.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 2,
        url: "https://p0.pxfuel.com/preview/228/64/6/soccer-boys-sports-outdoor.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        groupId: 3,
        url: "https://cdn2.hubspot.net/hubfs/408306/Ballroom%20dance%20party.jpg",
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
          [Op.in]: ["https://basketballword.com/wp-content/uploads/2019/07/Webp.net-resizeimage.jpg", "https://t3.ftcdn.net/jpg/02/21/10/40/360_F_221104021_sAMazMUFlHsCLvu1uDlkYdTAHZvQVwEE.jpg", "https://p0.pxfuel.com/preview/228/64/6/soccer-boys-sports-outdoor.jpg", "https://cdn2.hubspot.net/hubfs/408306/Ballroom%20dance%20party.jpg"]
        }
      },
      {}
    );
  }
};
