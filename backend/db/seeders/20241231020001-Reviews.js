'use strict';

const { Review } = require('../models');

//  START include for EVERY SEEDER for Render deployment
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
//  END include for EVERY SEEDER for Render deployment

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "This was an awesome spot!",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 3,
        review: "Great location, very clean and cozy",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 1,
        review: "Perfect place for a weekend getaway",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 3,
        review: "Nice spot but a bit pricey",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 1,
        review: "Beautiful views and great amenities",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 2,
        review: "Had a wonderful time here",
        stars: 4,
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {});
  }
};