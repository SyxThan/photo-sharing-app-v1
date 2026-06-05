const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {
	try {
		const user = await User.create(request.body);
		return response.status(201).json(user);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

router.get("/", async (request, response) => {
	try {
		const users = await User.find({});
		return response.json(users);
	} catch (error) {
		return response.status(500).json({ error: error.message });
	}
});

router.get("/:id", async (request, response) => {
	try {
		const user = await User.findById(request.params.id);
		if (!user) {
			return response.status(404).json({ error: "User not found" });
		}
		return response.json(user);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

router.get("/:id/stats", async (request, response) => {
	try {
		const userId = request.params.id;
		const Photo = require("../db/photoModel");
		const photoCount = await Photo.countDocuments({ user_id: userId });
		
		const photos = await Photo.find();
		let commentCount = 0;
		photos.forEach(photo => {
			if (photo.comments) {
				photo.comments.forEach(c => {
					if (c.user_id && c.user_id.toString() === userId) {
						commentCount++;
					}
				});
			}
		});
		return response.json({ photoCount, commentCount });
	} catch (error) {
		return response.status(500).json({ error: error.message });
	}
});

router.get("/:id/comments", async (request, response) => {
	try {
		const userId = request.params.id;
		const Photo = require("../db/photoModel");
		const photos = await Photo.find().populate("comments.user_id");
		let userComments = [];
		
		photos.forEach(photo => {
			if (photo.comments) {
				photo.comments.forEach(c => {
					if (c.user_id && (c.user_id._id.toString() === userId || c.user_id.toString() === userId)) {
						userComments.push({
							photo: { _id: photo._id, file_name: photo.file_name, user_id: photo.user_id },
							comment: c.comment,
							date_time: c.date_time
						});
					}
				});
			}
		});
		return response.json(userComments);
	} catch (error) {
		return response.status(500).json({ error: error.message });
	}
});

module.exports = router;