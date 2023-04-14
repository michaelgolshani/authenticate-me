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
        url: "https://ca-times.brightspotcdn.com/dims4/default/7600a12/2147483647/strip/true/crop/4608x3456+0+0/resize/1200x900!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fc6%2F4b%2F740409fa476d82ba0cf5e48190ce%2F20210404-190332.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 4,
        url: "https://www.basketballforcoaches.com/wp-content/uploads/2020/05/basketball-scrimmage.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 5,
        url: "https://www.versacourt.com/cmss_files/imagelibrary/general-use/thb-court-size.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      {
        url: {
          [Op.in]: ["https://d39l2hkdp2esp1.cloudfront.net/img/photo/124209/124209_00_2x.jpg", "https://basketballword.com/wp-content/uploads/2019/07/Webp.net-resizeimage.jpg", "https://frontofficesports.com/wp-content/uploads/2022/06/FOS-Sunday-6.19-MLS-Apple.jpg", "https://clips-media-assets2.twitch.tv/0naO0VAcJYzahW9kgKepTg/AT-cm%7C0naO0VAcJYzahW9kgKepTg-preview-480x272.jpg", "https://ca-times.brightspotcdn.com/dims4/default/7600a12/2147483647/strip/true/crop/4608x3456+0+0/resize/1200x900!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fc6%2F4b%2F740409fa476d82ba0cf5e48190ce%2F20210404-190332.jpg", "https://www.basketballforcoaches.com/wp-content/uploads/2020/05/basketball-scrimmage.jpg", "https://www.versacourt.com/cmss_files/imagelibrary/general-use/thb-court-size.jpg"]
        }
      },
      {}
    );
  }
};
