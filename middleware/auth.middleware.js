const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token"
      });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Unauthorized"
    });
  }
};

// Yahan hum 'protect' export kar rahe hain taaki routes mein { protect } kaam kare
module.exports = { protect };