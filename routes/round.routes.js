const express = require("express");
const router = express.Router();

const {
  createRound,
  generateResult
} = require("../controllers/roundController");

router.post("/create", createRound);
router.post("/generate", generateResult);

module.exports = router;