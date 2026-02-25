const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let otpStore = {}; // Temporary in-memory OTP store

/* ================= SEND OTP ================= */
const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.json({ success: false, msg: "Mobile required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    otpStore[mobile] = otp;

    // ✅ Terminal me print hoga
    console.log("OTP for", mobile, "is:", otp);

    res.json({
      success: true,
      msg: "OTP sent successfully"
    });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};


/* ================= VERIFY OTP ================= */
const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.json({ success: false, msg: "Mobile & OTP required" });
    }

    if (otpStore[mobile] !== otp) {
      return res.json({ success: false, msg: "Invalid OTP" });
    }

    // OTP verified, delete it
    delete otpStore[mobile];

    res.json({
      success: true,
      msg: "OTP verified successfully"
    });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};


/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    const { username, mobile, password } = req.body;

    if (!username || !mobile || !password) {
      return res.json({ success: false, msg: "All fields required" });
    }

    const exist = await User.findOne({ mobile });
    if (exist) {
      return res.json({ success: false, msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      mobile,
      password: hashedPassword,
      coins: 1000
    });

    res.json({ success: true, msg: "Registered successfully" });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};


/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.json({ success: false, msg: "Mobile & Password required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, msg: "Wrong password" });
    }

    const token = jwt.sign(
  {
    id: user._id,
    isAdmin: user.isAdmin   // 🔥 VERY IMPORTANT
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        mobile: user.mobile,
        coins: user.coins
      }
    });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  register,
  login
};