const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { placeBet, getMyBets } = require("../controllers/bet.controller");

router.post("/place", protect, placeBet);
router.get("/my", protect, getMyBets);

module.exports = router;