'use strict';

const { Spot } = require('../models');

//  START include for EVERY SEEDER for Render deployment
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
//  END include for EVERY SEEDER for Render deployment

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 1,
        address: "456 Coding Blvd",
        city: "New York",
        state: "New York",
        country: "United States of America",
        lat: 40.7127753,
        lng: -74.0059728,
        name: "Manhattan Coding Loft",
        description: "Luxury coding space in the heart of Manhattan",
        price: 250
      },
      {
        ownerId: 3,
        address: "789 Bay Area Blvd",
        city: "Oakland",
        state: "California",
        country: "United States of America",
        lat: 37.8044,
        lng: -122.2712,
        name: "Bay Area Getaway",
        description: "Beautiful spot with stunning bay views",
        price: 175
       },
       {
        ownerId: 1,
        address: "321 Sunset Drive",
        city: "Los Angeles",  
        state: "California",
        country: "United States of America",
        lat: 34.0522,
        lng: -118.2437,
        name: "LA Dreams",
        description: "Modern space in the heart of Hollywood",
        price: 200
       },
       {
        ownerId: 2,
        address: "555 Lake Shore Drive",
        city: "Chicago",
        state: "Illinois", 
        country: "United States of America",
        lat: 41.8781,
        lng: -87.6298,
        name: "Windy City Loft",
        description: "Luxurious loft overlooking Lake Michigan",
        price: 225
       },
       {
        ownerId: 3,
        address: "999 South Beach Way",
        city: "Miami",
        state: "Florida",
        country: "United States of America",
        lat: 25.7617,
        lng: -80.1918,
        name: "Miami Paradise",
        description: "Beachfront condo with ocean views",
        price: 300
       }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: {
        [Op.in]: [
          "123 Disney Lane",
          "456 Coding Blvd",
          "789 Developer Drive",
          "321 Startup Way",
          "555 Innovation Park",
          "777 Silicon Valley Road"
        ]
      }
    }, {});
  }
};