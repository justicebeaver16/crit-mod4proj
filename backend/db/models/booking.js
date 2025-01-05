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
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('createdAt')
          .toISOString()
          .replace('T', ' ')
          .replace('.000Z', '');
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('updatedAt')
          .toISOString()
          .replace('T', ' ')
          .replace('.000Z', '');
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  
  return Booking;
};