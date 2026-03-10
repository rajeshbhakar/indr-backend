const gameEngine = require("./services/gameEngine");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

/* ============================= */
/* ✅ ROOT ROUTE                 */
/* ============================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "INDR Backend is Live 🚀"
  });
});

/* ============================= */
/* ✅ ROUTES IMPORT              */
/* ============================= */

const authRoutes = require("./routes/auth.routes");
const betRoutes = require("./routes/bet.routes");
const roundRoutes = require("./routes/round.routes");
const walletRoutes = require("./routes/wallet.routes");
const adminRoutes = require("./routes/admin.routes");
const gameRoutes = require("./routes/game.routes");
const profileRoutes = require("./routes/profile.routes");

app.use("/api/auth", authRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/round", roundRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/profile", profileRoutes);

/* ============================= */
/* ✅ DATABASE CONNECT           */
/* ============================= */

// Rajesh ji, maine yahan direct URI daal di hai aur connection options badha diye hain
// Isse DNS issues (ECONNREFUSED) bypass hone ke chances zyada hain.


/* ============================= */
/* ❌ 404 HANDLER                */
/* ============================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

/* ============================= */
/* ✅ SERVER START               */
/* ============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

