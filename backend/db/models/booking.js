'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });
    }
  }

  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return this.getDataValue('startDate').toISOString().split('T')[0];
      },
      validate: {
        isDate: true,
        isNotPast(value) {
          if (new Date(value) < new Date()) {
            throw new Error('startDate cannot be in the past');
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return this.getDataValue('endDate').toISOString().split('T')[0];
      },
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (new Date(value) <= new Date(this.startDate)) {
            throw new Error('endDate cannot be on or before startDate');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      //owner view - includes user data
      withUser: {
        include: [{
          model: sequelize.models.User,
          attributes: ['id', 'firstName', 'lastName']
        }]
      },
      //guest view - excludes user data
      notOwner: {
        attributes: ['spotId', 'startDate', 'endDate']
      }
    },
    // validate: {
    //   //so booking dates don't overlap
    //   async noOverlappingBookings() {
    //     const existingBooking = await Booking.findOne({
    //       where: {
    //         spotId: this.spotId,
    //         id: { [sequelize.Op.ne]: this.id }, //excludes current booking if updating
    //         [sequelize.Op.or]: [
    //           {
    //             startDate: {
    //               [sequelize.Op.between]: [this.startDate, this.endDate]
    //             }
    //           },
    //           {
    //             endDate: {
    //               [sequelize.Op.between]: [this.startDate, this.endDate]
    //             }
    //           },
    //           {
    //             [sequelize.Op.and]: [
    //               { startDate: { [sequelize.Op.lte]: this.startDate } },
    //               { endDate: { [sequelize.Op.gte]: this.endDate } }
    //             ]
    //           }
    //         ]
    //       }
    //     });

    //     if (existingBooking) {
    //       throw new Error('Sorry, this spot is already booked for the specified dates');
    //     }
    //   }
    // }
  });
  return Booking;
};