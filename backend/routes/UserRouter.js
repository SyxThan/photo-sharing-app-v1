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

module.exports = router;