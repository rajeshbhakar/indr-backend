const express = require("express");
const router = express.Router();

// Yahan galti thi: Humne { protect } ko destructure kiya hai
const { protect } = require("../middleware/auth.middleware");

// Ab authMiddleware ki jagah protect use karo
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;