const express = require("express");
const router = express.Router();


const { protect } = require("../middleware/auth.middleware");

router.get("/balance", protect, (req, res) => {
    
});

module.exports = router;