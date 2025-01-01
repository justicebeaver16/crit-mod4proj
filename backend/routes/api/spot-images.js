const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//delete a spot image
router.delete('/:imageId', requireAuth, async (req, res) => {
 const spotImage = await SpotImage.findByPk(req.params.imageId, {
   include: [{ model: Spot }]
 });

 if (!spotImage) {
   return res.status(404).json({ message: "Spot Image couldn't be found" });
 }

 if (spotImage.Spot.ownerId !== req.user.id) {
   return res.status(403).json({ message: "Forbidden" });
 }

 await spotImage.destroy();
 res.json({ message: "Successfully deleted" });
});

module.exports = router;