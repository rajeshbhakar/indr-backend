const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    let token = req.headers.authorization;

    if (!token)
      return res.json({ success: false, msg: "No token provided" });

    // Remove Bearer
    if (token.startsWith("Bearer "))
      token = token.slice(7).trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT FIX 👇
    req.user = {
      id: decoded.id || decoded._id
    };

    next();

  } catch (err) {
    console.log("TOKEN ERROR:", err.message);
    res.json({ success: false, msg: "Invalid token" });
  }
};
