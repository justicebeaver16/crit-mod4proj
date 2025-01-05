const express = require('express');
const { Sequelize } = require('sequelize');
const { Spot, SpotImage, Review, User, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { validateSpot, validateQuery } = require('../../utils/validation');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

//get all spots
router.get('/', validateQuery, async (req, res) => {
  try{
  let { minLat, maxLat, minLng, maxLng } = req.query;

  const where = {};

  if (minLat || maxLat) {
    where.lat = {};
    if (minLat) where.lat[Op.gte] = Number(minLat);
    if (maxLat) where.lat[Op.lte] = Number(maxLat);
  }
  if (minLng || maxLng) {
    where.lng = {};
    if (minLng) where.lng[Op.gte] = Number(minLng);
    if (maxLng) where.lng[Op.lte] = Number(maxLng);
  }

    const spots = await Spot.findAll({
        where,
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                where: { preview: true },
                required: false,
                attributes: ['url']
            }
        ],
        group: ['Spot.id', 'SpotImages.id'],
        attributes: {
          include: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [Sequelize.fn('COALESCE', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 0), 'avgRating']
        ]
        }
    });

    const formattedSpots = spots.map(spot => {
      const spotData = spot.toJSON();
      spotData.avgRating = Number(spotData.avgRating).toFixed(1);
      spotData.previewImage = spotData.SpotImages?.[0]?.url || null;
      delete spotData.SpotImages;
      return spotData;
  });

    return res.json({ Spots: formattedSpots });

}catch (error) {
  console.error('Error:', error);
  return res.status(500).json({
      message: "An error occurred while fetching spots",
      errors: error.errors ? error.errors.map(err => err.message) : [error.message]
  });
}
});

//get current user's spots
router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Review,
          attributes: []
        },
        {
          model: SpotImage,
          where: { preview: true },
          required: false,
          attributes: ['url']
        }
      ],
      group: ['Spot.id', 'SpotImages.id'],
        attributes: {
            include: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'description',
                'price',
                'createdAt',
                'updatedAt',
                [Sequelize.fn('COALESCE', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 0), 'avgRating']
            ]
      }
    });
    const formattedSpots = spots.map(spot => {
      const spotData = spot.toJSON();
      spotData.avgRating = Number(spotData.avgRating).toFixed(1);
      spotData.previewImage = spotData.SpotImages?.[0]?.url || null;
      delete spotData.SpotImages;
      return spotData;
  });

    res.json({ Spots: formattedSpots });
   });

//get spot details by id
router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Review,
          attributes: []
        }
      ],
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
        ]
      },
      group: ['Spot.id', 'SpotImages.id', 'Owner.id']
    });
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    res.json(spot);
   });

//create a spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const spot = await Spot.create({
        ownerId: req.user.id,
        ...req.body
    });
    
    return res.status(201).json(spot);
});

//add image to spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
   
    const { url, preview } = req.body;
    const image = await SpotImage.create({
      spotId: spot.id,
      url,
      preview
    });
   
    res.status(201).json({
      id: image.id,
      url: image.url, 
      preview: image.preview
    });
   });

//edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
   
    await spot.update(req.body);
    const updatedSpot = await Spot.findByPk(req.params.spotId, {
      attributes: [
          'id', 
          'ownerId', 
          'address', 
          'city', 
          'state', 
          'country', 
          'lat', 
          'lng', 
          'name', 
          'description', 
          'price',
          'createdAt',
          'updatedAt'
      ]
  });

    res.json(updatedSpot);
   });

//delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
   
    await spot.destroy();
    res.json({ message: "Successfully deleted" });
   });

//get reviews by spot id
router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    const reviews = await Review.findAll({
      where: { spotId: req.params.spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });
   
    res.json({ Reviews: reviews });
   });

//create review for a spot
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    const existingReview = await Review.findOne({
      where: {
        spotId: req.params.spotId,
        userId: req.user.id
      }
    });
   
    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this spot" });
    }
   
    const { review, stars } = req.body;
    const newReview = await Review.create({
      spotId: parseInt(req.params.spotId),
      userId: req.user.id,
      review,
      stars
    });
   
    res.status(201).json(newReview);
   });

//get bookings by spot id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    if (spot.ownerId === req.user.id) {
      const bookings = await Booking.findAll({
        where: { spotId: req.params.spotId },
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      });
      return res.json({ Bookings: bookings });
    } else {
      const bookings = await Booking.findAll({
        where: { spotId: req.params.spotId },
        attributes: ['spotId', 'startDate', 'endDate']
      });
      return res.json({ Bookings: bookings });
    }
   });

//create a booking
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
   
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
   
    if (spot.ownerId === req.user.id) {
      return res.status(403).json({ message: "Cannot book your own spot" });
    }
   
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
   
    if (end <= start) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate"
        }
      });
    }
   
    const conflictingBooking = await Booking.findOne({
      where: {
        spotId: req.params.spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [start, end]
            }
          },
          {
            endDate: {
              [Op.between]: [start, end]
            }
          }
        ]
      }
    });
   
    if (conflictingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }
   
    const booking = await Booking.create({
      spotId: parseInt(req.params.spotId),
      userId: req.user.id,
      startDate: start,
      endDate: end
    });
   
    res.status(201).json(booking);
   });

module.exports = router;