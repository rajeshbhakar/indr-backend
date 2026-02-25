exports.adminOnly = (req, res, next) => {

  console.log("ADMIN CHECK:", req.user);

  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }
};