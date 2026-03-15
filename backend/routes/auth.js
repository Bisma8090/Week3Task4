const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const jwt     = require("jsonwebtoken");
const { protect } = require("../middleware/auth");

// ✅ Generate JWT helper
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// ✅ POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    // ✅ Just return success — don't auto-login on register
    res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // ✅ Must use .select("+password") because select: false in model
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/auth/me — verify token & return user
router.get("/me", protect, async (req, res) => {
  res.json({
    user: {
      id:    req.user._id,
      name:  req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = router;