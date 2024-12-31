'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, {
        foreignKey: 'reviewId'
      });
    }
  }

  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Image URL is required"
        },
        isUrl: {
          msg: "Must be a valid URL"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
    defaultScope: {
      attributes: ['id', 'url']  //only return id and url
    },
    scopes: {
      withAll: {
        attributes: { include: ['reviewId', 'createdAt', 'updatedAt'] }
      }
    },
    validate: {
      async maxImagesPerReview() {
        const imageCount = await ReviewImage.count({
          where: { reviewId: this.reviewId }
        });
        if (imageCount >= 10) {
          throw new Error('Maximum number of images for this resource was reached');
        }
      }
    }
  });
  return ReviewImage;
};