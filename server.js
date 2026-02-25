const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const startAutoGame = require("./services/autoGameEngine");

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/wallet", require("./routes/wallet.routes"));
app.use("/api/game", require("./routes/game.routes"));
app.use("/api/round", require("./routes/round.routes"));
app.use("/api/bet", require("./routes/bet.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

/* TEST */
app.get("/", (req, res) => {
  res.send("INDR BACKEND CONNECTED");
});

/* START SERVER */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // ✅ Only ONE engine
  startAutoGame();

});