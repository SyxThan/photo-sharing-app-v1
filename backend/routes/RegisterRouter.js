const express = require("express");
const User = require("../db/userModel");

const router = express.Router();


router.post("/", async (request, response) => {
  try {
    const { login_name, password, first_name, last_name, location, description, occupation } = request.body;
    
    if (!login_name || !login_name.trim()) {
      return response.status(400).json({ error: "login_name is required" });
    }

    if (!password || !password.trim()) {
      return response.status(400).json({ error: "password is required" });
    }

    if (!first_name || !first_name.trim()) {
      return response.status(400).json({ error: "first_name is required" });
    }

    if (!last_name || !last_name.trim()) {
      return response.status(400).json({ error: "last_name is required" });
    }

    const existingUser = await User.findOne({ login_name: login_name.trim() });
    if (existingUser) {
      return response.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
    }

    const newUser = await User.create({
      login_name: login_name.trim(),
      password: password.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      location: location ? location.trim() : "",
      description: description ? description.trim() : "",
      occupation: occupation ? occupation.trim() : ""
    });

    return response.status(201).json({
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      location: newUser.location,
      description: newUser.description,
      occupation: newUser.occupation
    });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = router;
