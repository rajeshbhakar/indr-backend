const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { getWallet, addCoins, deductCoins } = require("../controllers/wallet.controller");

router.get("/balance", protect, getWallet);
router.post("/add", protect, addCoins);
router.post("/deduct", protect, deductCoins);

module.exports = router;    