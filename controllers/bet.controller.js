const Bet = require("../models/bet.model");
const Round = require("../models/Round");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");

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

    // 🔍 Get running round
    const runningRound = await Round.findOne({ status: "running" });

    if (!runningRound) {
      return res.json({
        success: false,
        message: "No active round"
      });
    }

    // 🔒 Lock check
    if (runningRound.bettingLocked === true) {
      return res.json({
        success: false,
        message: "Betting is closed for this round"
      });
    }

    /* ============================= */
    /* 🔐 ATOMIC WALLET DEDUCTION   */
    /* ============================= */

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        wallet: { $gte: amount }   // 💣 balance check inside query
      },
      {
        $inc: { wallet: -amount }  // atomic deduction
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "Insufficient balance"
      });
    }

    /* ============================= */
    /* 🎯 CREATE BET                */
    /* ============================= */

    const bet = await Bet.create({
      userId,
      roundId: runningRound.roundId,
      betType,
      betValue,
      amount,
      status: "pending",
      winAmount: 0
    });

    /* ============================= */
    /* 🧾 LOG TRANSACTION           */
    /* ============================= */

    await Transaction.create({
      userId,
      type: "debit",
      amount,
      balanceAfter: updatedUser.wallet,
      reason: "Bet Placed",
      roundId: runningRound.roundId
    });

    res.json({
      success: true,
      message: "Bet placed successfully",
      bet,
      balance: updatedUser.wallet
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};