import express from "express";

const router = express.Router();

// 🟢 Current Game Info
router.get("/wingo", (req, res) => {
  res.json({
    time: 30,
    period: "202603171234"
  });
});

// 🟢 History
router.get("/wingo/history", (req, res) => {
  res.json([
    { number: 2, color: "red" },
    { number: 7, color: "green" },
    { number: 5, color: "violet" }
  ]);
});

// 🟢 Bet
router.post("/wingo/bet", (req, res) => {
  res.json({
    success: true,
    message: "Bet placed successfully"
  });
});

export default router;