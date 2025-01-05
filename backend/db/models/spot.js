'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define associations here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner'
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }

  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Street address is required"
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "State is required"
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Country is required"
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL(9,7),
      allowNull: false,
      validate: {
        min: {
          args: [-90],
          msg: "Latitude must be within -90 and 90"
        },
        max: {
          args: [90],
          msg: "Latitude must be within -90 and 90"
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: false,
      validate: {
        min: {
          args: [-180],
          msg: "Longitude must be within -180 and 180"
        },
        max: {
          args: [180],
          msg: "Longitude must be within -180 and 180"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Name must be less than 50 characters"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Price per day must be a positive number"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      withPreviewImage: {
        include: [{
          model: sequelize.models.SpotImage,
          where: { preview: true },
          attributes: ['url'],
          required: false,
          limit: 1
        }]
      }
    }
  });
  return Spot;
};