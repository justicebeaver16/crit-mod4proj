'use strict';

const { Booking } = require('../models');

//  START include for EVERY SEEDER for Render deployment
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
//  END include for EVERY SEEDER for Render deployment

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2025-11-19'),
        endDate: new Date('2025-11-20')
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2025-12-19'),
        endDate: new Date('2025-12-20')
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date('2025-10-19'),
        endDate: new Date('2025-10-20')
      },
      {
        spotId: 1,
        userId: 3,
        startDate: new Date('2025-09-19'),
        endDate: new Date('2025-09-20')
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date('2025-08-19'),
        endDate: new Date('2025-08-20')
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date('2025-07-19'),
        endDate: new Date('2025-07-20')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};