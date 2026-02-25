const Bet = require("../models/bet.model");
const Round = require("../models/Round");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");

/* ========================================= */
/* ✅ ADMIN DASHBOARD STATS (PROFIT CORE)   */
/* ========================================= */
exports.getDashboardStats = async (req, res) => {
  try {

    // 👥 Total Users
    const totalUsers = await User.countDocuments();

    // 🎯 Total Rounds
    const totalRounds = await Round.countDocuments();

    // 🎲 Total Bets
    const totalBets = await Bet.countDocuments();

    // 💰 Total Bet Amount (All time turnover)
    const totalBetAmountAgg = await Bet.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalBetAmount = totalBetAmountAgg[0]?.total || 0;

    // 🏆 Total Payout (All winnings paid)
    const totalPayoutAgg = await Bet.aggregate([
      { $match: { status: "won" } },
      { $group: { _id: null, total: { $sum: "$winAmount" } } }
    ]);
    const totalPayout = totalPayoutAgg[0]?.total || 0;

    // 💎 Platform Profit
    const platformProfit = totalBetAmount - totalPayout;

    // 💸 Total Commission (4% earnings)
    const totalCommission = totalBetAmount * 0.04;

    // 🔄 Active Users (placed bet in last 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsersAgg = await Bet.aggregate([
      { $match: { createdAt: { $gte: yesterday } } },
      { $group: { _id: "$userId" } }
    ]);
    const activeUsers = activeUsersAgg.length;

    // 🟢 Currently Running Round
    const runningRound = await Round.findOne({ status: "running" });

    res.json({
      success: true,

      stats: {
        totalUsers,
        activeUsers,
        totalRounds,
        totalBets,
        totalBetAmount,
        totalPayout,
        platformProfit,
        totalCommission
      },

      runningRound: runningRound || null
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};