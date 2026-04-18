const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

router.post("/", async (request, response) => {
	try {
		const photo = await Photo.create(request.body);
		return response.status(201).json(photo);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

router.get("/", async (request, response) => {
	try {
		const photos = await Photo.find({});
		return response.json(photos);
	} catch (error) {
		return response.status(500).json({ error: error.message });
	}
});

router.get("/user/:userId", async (request, response) => {
	try {
		const photos = await Photo.find({ user_id: request.params.userId });
		return response.json(photos);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

router.get("/:id", async (request, response) => {
	try {
		const photo = await Photo.findById(request.params.id);
		if (!photo) {
			return response.status(404).json({ error: "Photo not found" });
		}
		return response.json(photo);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

module.exports = router;
