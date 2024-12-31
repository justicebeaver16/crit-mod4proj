'use strict';

//  START include for EVERY MIGRATION for Render deployment
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
//  END include for EVERY MIGRATION for Render deployment

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options); //include for EVERY MIGRATION for Render deployment

    // //for query optimization
    // await queryInterface.addIndex('Bookings', ['spotId']);
    // await queryInterface.addIndex('Bookings', ['userId']);
    
    // //for date range queries
    // await queryInterface.addIndex('Bookings', ['startDate', 'endDate']);
    
    // //to prevent duplicate bookings
    // await queryInterface.addIndex(
    //   'Bookings',
    //   ['spotId', 'startDate', 'endDate'],
    //   {
    //     unique: true,
    //     name: 'unique_booking'
    //   }
    // );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.dropTable(options);
  }
};