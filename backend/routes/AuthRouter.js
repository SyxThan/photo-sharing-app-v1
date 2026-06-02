const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../db/userModel");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-jwt-key-change-this-in-production";


router.post("/login", async (request, response) => {
  try {
    const { login_name, password } = request.body;
    
    if (!login_name) {
      return response.status(400).json({ error: "login_name is required" });
    }

    if (!password) {
      return response.status(400).json({ error: "password is required" });
    }

    const user = await User.findOne({ login_name });
    
    if (!user) {
      return response.status(400).json({ error: "Invalid login_name or password" });
    }

    if (user.password !== password.trim()) {
      return response.status(400).json({ error: "Invalid login_name or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return response.json({
      token: token,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation
      }
    });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

router.post("/logout", (request, response) => {
  response.json({ message: "Dang xuat thanh cong" });
});

module.exports = router;
