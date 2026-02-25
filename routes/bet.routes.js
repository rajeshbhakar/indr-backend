const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { placeBet } = require("../controllers/bet.controller");

router.post("/place", protect, placeBet);

module.exports = router;