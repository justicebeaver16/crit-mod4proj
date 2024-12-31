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
        //add lat and lng if needed
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
        //add lat and lng if needed
        name: "Manhattan Coding Loft",
        description: "Luxury coding space in the heart of Manhattan",
        price: 250
      },
      {
        ownerId: 2,
        address: "789 Developer Drive",
        city: "Seattle",
        state: "Washington",
        country: "United States of America",
        //add lat and lng if needed
        name: "Tech Hub Haven",
        description: "Modern workspace with stunning city views",
        price: 175
      },
      {
        ownerId: 2,
        address: "321 Startup Way",
        city: "Austin",
        state: "Texas",
        country: "United States of America",
        //add lat and lng if needed
        name: "Austin Tech Center",
        description: "Collaborative space in Austin's tech district",
        price: 150
      },
      {
        ownerId: 3,
        address: "555 Innovation Park",
        city: "Boston",
        state: "Massachusetts",
        country: "United States of America",
        //add lat and lng if needed
        name: "Boston Code Suite",
        description: "Historic building renovated for modern tech use",
        price: 200
      },
      {
        ownerId: 3,
        address: "777 Silicon Valley Road",
        city: "San Jose",
        state: "California",
        country: "United States of America",
        //add lat and lng if needed
        name: "Valley Tech Space",
        description: "Prime location in the heart of Silicon Valley",
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