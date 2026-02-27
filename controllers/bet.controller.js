const Bet = require("../models/bet.model");
const Round = require("../models/Round");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");

/* ============================= */
/* 🎯 PLACE BET                 */
/* ============================= */

exports.placeBet = async (req, res) => {
  try {

    const { betType, betValue, amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.json({
        success: false,
        message: "Invalid bet amount"
      });
    }

    const runningRound = await Round.findOne({ status: "running" });

    if (!runningRound) {
      return res.json({
        success: false,
        message: "No active round"
      });
    }

    if (runningRound.bettingLocked === true) {
      return res.json({
        success: false,
        message: "Betting is closed for this round"
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        coins: { $gte: amount }
      },
      {
        $inc: { coins: -amount }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "Insufficient balance"
      });
    }

    const bet = await Bet.create({
      userId,
      roundId: runningRound.roundId,
      betType,
      betValue,
      amount,
      status: "pending",
      winAmount: 0
    });

    await Transaction.create({
      userId,
      type: "debit",
      amount,
      balanceAfter: updatedUser.coins,
      reason: "Bet Placed",
      roundId: runningRound.roundId
    });

    res.json({
      success: true,
      message: "Bet placed successfully",
      bet,
      balance: updatedUser.coins
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================= */
/* 📜 GET MY BETS               */
/* ============================= */

exports.getMyBets = async (req, res) => {
  try {
    const userId = req.user.id;

    const bets = await Bet.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bets.length,
      bets
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};