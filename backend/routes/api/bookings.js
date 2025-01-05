const express = require('express');
const { Booking, User, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage('Start date is required'),
  check('endDate')
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage('End date is required')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('endDate cannot be on or before startDate');
      }
      return true;
    }),
  handleValidationErrors
];

//create a booking
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const booking = await Booking.create({
    spotId: parseInt(req.params.spotId),
    userId: req.user.id,
    startDate: start,
    endDate: end
});

const formattedBooking = {
  ...booking.toJSON(),
  startDate: booking.startDate.toISOString().split('T')[0],
  endDate: booking.endDate.toISOString().split('T')[0]
};

res.status(201).json(formattedBooking);
});

//get all current user's bookings
router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: {
      model: Spot,
      attributes: { 
        exclude: ['description', 'createdAt', 'updatedAt'] 
      },
      include: [{
        model: SpotImage,
        where: { preview: true },
        attributes: ['url'],
        required: false
      }]
    }
  });

  const formattedBookings = bookings.map(booking => {
    const bookingData = booking.toJSON();
    if (bookingData.Spot.SpotImages.length > 0) {
      bookingData.Spot.previewImage = bookingData.Spot.SpotImages[0].url;
    }
    delete bookingData.Spot.SpotImages;
    bookingData.startDate = booking.startDate.toISOString().split('T')[0];
    bookingData.endDate = booking.endDate.toISOString().split('T')[0];
    return bookingData;
  });

  res.json({ Bookings: formattedBookings });
});

//edit a booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (new Date(booking.endDate) < new Date()) {
    return res.status(403).json({ message: "Past bookings can't be modified" });
  }

  const { startDate, endDate } = req.body;
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: booking.spotId,
      id: { [Op.ne]: booking.id },
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        },
        {
          endDate: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
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

  await booking.update(req.body);

  const formattedBooking = {
    ...booking.toJSON(),
    startDate: booking.startDate.toISOString().split('T')[0],
    endDate: booking.endDate.toISOString().split('T')[0]
  };

  res.json(formattedBooking);
});

//delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId, {
    include: [{ model: Spot }]
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== req.user.id && booking.Spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (new Date(booking.startDate) <= new Date()) {
    return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
  }

  await booking.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;