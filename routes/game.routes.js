const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const gameController = require("../controllers/game.controller");

router.post("/bet", auth.protect, gameController.placeBet);
router.get("/history", auth.protect, gameController.getHistory);
router.get("/status", gameController.getGameStatus);

module.exports = router;