const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

router.post("/:photoId", async (request, response) => {
  try {
    const photo = await Photo.findById(request.params.photoId);
    if (!photo) {
      return response.status(404).json({ error: "Photo not found" });
    }

    photo.comments.push({
      comment: request.body.comment,
      date_time: request.body.date_time,
      user_id: request.body.user_id,
    });

    const updatedPhoto = await photo.save();
    return response.status(201).json(updatedPhoto);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

router.get("/:photoId", async (request, response) => {
  try {
    const photo = await Photo.findById(request.params.photoId);
    if (!photo) {
      return response.status(404).json({ error: "Photo not found" });
    }

    return response.json(photo.comments || []);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = router;