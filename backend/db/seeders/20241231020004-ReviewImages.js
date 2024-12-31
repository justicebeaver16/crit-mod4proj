'use strict';

const { ReviewImage } = require('../models');

//  START include for EVERY SEEDER for Render deployment
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
//  END include for EVERY SEEDER for Render deployment

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://example.com/review1-image1.jpg"
      },
      {
        reviewId: 1,
        url: "https://example.com/review1-image2.jpg"
      },
      {
        reviewId: 2,
        url: "https://example.com/review2-image1.jpg"
      },
      {
        reviewId: 2,
        url: "https://example.com/review2-image2.jpg"
      },
      {
        reviewId: 3,
        url: "https://example.com/review3-image1.jpg"
      },
      {
        reviewId: 3,
        url: "https://example.com/review3-image2.jpg"
      },
      {
        reviewId: 4,
        url: "https://example.com/review4-image1.jpg"
      },
      {
        reviewId: 5,
        url: "https://example.com/review5-image1.jpg"
      },
      {
        reviewId: 6,
        url: "https://example.com/review6-image1.jpg"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};