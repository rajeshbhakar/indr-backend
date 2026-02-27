const User = require("../models/user.model");

/* ================= GET WALLET ================= */
const getWallet = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized"
      });
    }

    res.json({
      success: true,
      coins: req.user.coins,
      user: {
        username: req.user.username,
        mobile: req.user.mobile
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }
};

/* ================= ADD COINS ================= */
const addCoins = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.json({ success: false, msg: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);

    user.coins += Number(amount);
    await user.save();

    res.json({
      success: true,
      msg: "Coins added",
      coins: user.coins
    });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};

/* ================= DEDUCT COINS ================= */
const deductCoins = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.json({ success: false, msg: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);

    if (user.coins < amount) {
      return res.json({
        success: false,
        msg: "Insufficient balance"
      });
    }

    user.coins -= Number(amount);
    await user.save();

    res.json({
      success: true,
      msg: "Coins deducted",
      coins: user.coins
    });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};

module.exports = {
  getWallet,
  addCoins,
  deductCoins
};