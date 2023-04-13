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
        url: "https://d39l2hkdp2esp1.cloudfront.net/img/photo/124209/124209_00_2x.jpg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 1,
        url: "https://basketballword.com/wp-content/uploads/2019/07/Webp.net-resizeimage.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 2,
        url: "https://frontofficesports.com/wp-content/uploads/2022/06/FOS-Sunday-6.19-MLS-Apple.jpg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 2,
        url: "https://clips-media-assets2.twitch.tv/0naO0VAcJYzahW9kgKepTg/AT-cm%7C0naO0VAcJYzahW9kgKepTg-preview-480x272.jpg",
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
