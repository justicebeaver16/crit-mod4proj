const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//delete a review image
router.delete('/:imageId', requireAuth, async (req, res) => {
 const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
   include: [{ model: Review }]
 });

 if (!reviewImage) {
   return res.status(404).json({ message: "Review Image couldn't be found" });
 }

 if (reviewImage.Review.userId !== req.user.id) {
   return res.status(403).json({ message: "Forbidden" });
 }

 await reviewImage.destroy();

    res.json({
        message: "Successfully deleted"
    });
});

module.exports = router;