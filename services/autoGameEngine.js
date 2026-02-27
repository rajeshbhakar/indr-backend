const Round = require("../models/Round");
const Bet = require("../models/bet.model");
const User = require("../models/user.model");

exports.generateResult = async (req, res) => {
  try {

    const runningRound = await Round.findOne({ status: "running" });

    if (!runningRound) {
      return res.json({
        success: false,
        message: "No running round"
      });
    }

    // 🎲 Random number 0-9
    const resultNumber = Math.floor(Math.random() * 10);

    const size = resultNumber >= 5 ? "Big" : "Small";
    const color = resultNumber % 2 === 0 ? "Red" : "Green";

    runningRound.result = resultNumber;
    runningRound.status = "ended";
    await runningRound.save();

    /* =============================== */
    /* 🔥 SETTLE ALL BETS OF ROUND    */
    /* =============================== */

    const bets = await Bet.find({
      roundId: runningRound.roundId,
      status: "pending"
    });

    for (let bet of bets) {

      let isWin = false;

      if (bet.betType === "number" && bet.betValue == resultNumber) {
        isWin = true;
      }

      if (bet.betType === "size" && bet.betValue === size) {
        isWin = true;
      }

      if (bet.betType === "color" && bet.betValue === color) {
        isWin = true;
      }

      if (isWin) {

        const winAmount = bet.amount * 2; // simple 2x payout

        bet.status = "win";
        bet.winAmount = winAmount;
        await bet.save();

        await User.findByIdAndUpdate(
          bet.userId,
          { $inc: { coins: winAmount } }
        );

      } else {

        bet.status = "lose";
        bet.winAmount = 0;
        await bet.save();

      }
    }

    res.json({
      success: true,
      result: resultNumber,
      size,
      color,
      totalBets: bets.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};