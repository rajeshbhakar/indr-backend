const express = require("express");
const router = express.Router();

// Middlewares check
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { getDashboardStats } = require("../controllers/admin.controller");

// Debugging: Ye console mein dikhayega agar kuch missing hai
console.log("Checking Imports:", { 
    protect: typeof protect, 
    adminOnly: typeof adminOnly, 
    getDashboardStats: typeof getDashboardStats 
});

router.get("/dashboard", protect, adminOnly, getDashboardStats);

module.exports = router;