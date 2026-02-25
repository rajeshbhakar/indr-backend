const GameHistory = require("../models/gamehistory.model");
const User = require("../models/user.model");
const { getTimer, getRound } = require("../services/bigSmallEngine");

/* ================= PLACE BET ================= */
exports.placeBet = async (req, res) => {
  try {
    const { amount, choice } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.json({ success: false, msg: "Invalid bet amount" });
    }

    if (!["big", "small"].includes(choice)) {
      return res.json({ success: false, msg: "Invalid choice" });
    }

    // Timer check (last 5 seconds me bet allow nahi)
    if (getTimer() <= 5) {
      return res.json({
        success: false,
        msg: "Betting closed for this round"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    if (user.coins < amount) {
      return res.json({ success: false, msg: "Insufficient balance" });
    }

    // 💰 AUTO WALLET DEDUCT
    user.coins -= Number(amount);
    await user.save();

    const bet = await GameHistory.create({
      userId,
      game: "bigsmall",
      amount,
      choice,
      winAmount: 0,
      status: "pending",
      roundId: getRound()
    });

    res.json({
      success: true,
      msg: "Bet placed successfully",
      bet,
      remainingCoins: user.coins
    });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};

/* ================= GET HISTORY ================= */
exports.getHistory = async (req, res) => {
  try {
    const history = await GameHistory.find({
      userId: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, history });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};

/* ================= GAME STATUS ================= */
exports.getGameStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      round: getRound(),
      timer: getTimer(),
      lastResult: global.lastResult || null,
      lastNumber: global.lastNumber || null
    });
  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};