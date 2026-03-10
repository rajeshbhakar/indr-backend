const express = require("express");
const router = express.Router();

const { setResult } = require("../controllers/adminResult.controller");

const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

/* ================= ADMIN RESULT CONTROL ================= */

router.post("/set-result", protect, adminOnly, setResult);

module.exports = router;