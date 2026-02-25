const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const gameController = require("../controllers/game.controller");

router.post("/bet", auth, gameController.placeBet);
router.get("/history", auth, gameController.getHistory);

module.exports = router;
    router.get("/status", gameController.getGameStatus);
