const express = require("express");
const router = express.Router();

const {
  createRound,
  generateResult
} = require("../controllers/roundController");

const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

/* ============================= */
/* ADMIN ONLY ROUND CONTROL      */
/* ============================= */

router.post("/create", protect, adminOnly, createRound);

router.post("/generate", protect, adminOnly, generateResult);

module.exports = router;  