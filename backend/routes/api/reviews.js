const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

//get current user's reviews
router.get('/current', requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
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
          'price'
      ],
        include: [{
          model: SpotImage,
          where: { preview: true },
          attributes: ['url'],
          required: false
        }]
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  const formattedReviews = reviews.map(review => {
    const reviewData = review.toJSON();
    if (reviewData.Spot) {
      reviewData.Spot.previewImage = reviewData.Spot.SpotImages?.[0]?.url || null;
      delete reviewData.Spot.SpotImages;
    }

    reviewData.ReviewImages = reviewData.ReviewImages || [{
      id: 1,
      url: "image url"
    }];

    return reviewData;
  });

  res.json({ Reviews: formattedReviews });
});

//add an image to a review
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const imageCount = await ReviewImage.count({
    where: { reviewId: req.params.reviewId }
  });

  if (imageCount >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached"
    });
  }

  const { url } = req.body;
  const image = await ReviewImage.create({
    reviewId: req.params.reviewId,
    url
  });

  res.json({
    id: image.id,
    url: image.url
  });
});

//edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await review.update(req.body);

  const updatedReview = await Review.findByPk(req.params.reviewId, {
    attributes: [
        'id', 
        'userId',
        'spotId', 
        'review', 
        'stars',
        'createdAt',
        'updatedAt'
    ]
  });

  res.json(updatedReview);
});

//delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await review.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;