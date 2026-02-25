const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
  register,
  login
} = require("../controllers/auth.controller");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", login);

module.exports = router;