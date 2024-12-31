'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // define associations here
      Review.belongsTo(models.User, { 
        foreignKey: 'userId'
      });
      
      Review.belongsTo(models.Spot, { 
        foreignKey: 'spotId'
      });
      
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }

  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Review text is required"
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Stars must be an integer from 1 to 5"
        },
        max: {
          args: [5],
          msg: "Stars must be an integer from 1 to 5"
        },
        isInt: {
          msg: "Stars must be an integer from 1 to 5"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      withAssociations: {
        include: [
          {
            model: sequelize.models.User,
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: sequelize.models.ReviewImage,
            attributes: ['id', 'url']
          }
        ]
      }
    }
  });
  return Review;
};