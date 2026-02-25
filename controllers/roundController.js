const Round = require("../models/Round");
const Bet = require("../models/bet.model");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");

/* ============================= */
/* ✅ CREATE ROUND               */
/* ============================= */
exports.createRound = async (req, res) => {
  try {

    const existingRound = await Round.findOne({ status: "running" });

    if (existingRound) {
      return res.json({
        success: false,
        message: "A round is already running",
        round: existingRound
      });
    }

    const roundId = "R" + Date.now();

    const round = await Round.create({
      roundId,
      startTime: new Date(),
      status: "running",
      bettingLocked: false
    });

    res.json({
      success: true,
      round
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ============================= */
/* ✅ GENERATE RESULT + SETTLE   */
/* ============================= */
exports.generateResult = async (req, res) => {
  try {

    const runningRound = await Round.findOne({ status: "running" });

    if (!runningRound) {
      return res.json({
        success: false,
        message: "No running round found"
      });
    }

    const result = Math.floor(Math.random() * 10);

    const size = result >= 5 ? "Big" : "Small";

    let color;
    if ([1, 3, 7, 9].includes(result)) color = "Red";
    else if ([2, 4, 6, 8].includes(result)) color = "Green";
    else color = "Violet";

    const bets = await Bet.find({
      roundId: runningRound.roundId,
      status: "pending"
    });

    for (let bet of bets) {

      let isWinner = false;
      let multiplier = 0;

      if (bet.betType === "number" && Number(bet.betValue) === result) {
        isWinner = true;
        multiplier = 9;
      }

      if (bet.betType === "bigSmall" && bet.betValue === size) {
        isWinner = true;
        multiplier = 2;
      }

      if (bet.betType === "color" && bet.betValue === color) {
        isWinner = true;
        multiplier = (color === "Violet") ? 4 : 2;
      }

      const user = await User.findById(bet.userId);

      if (isWinner) {

        const winAmount = bet.amount * multiplier;
        const finalPayout = winAmount * 0.96;

        bet.status = "won";
        bet.winAmount = finalPayout;

        if (user) {
          user.wallet += finalPayout;
          await user.save();

          // 🧾 Ledger Entry (Credit)
          await Transaction.create({
            userId: user._id,
            type: "credit",
            amount: finalPayout,
            balanceAfter: user.wallet,
            reason: "Bet Win",
            roundId: runningRound.roundId
          });
        }

      } else {
        bet.status = "lost";
        bet.winAmount = 0;
      }

      await bet.save();
    }

    runningRound.result = result;
    runningRound.status = "ended";
    runningRound.endTime = new Date();
    runningRound.bettingLocked = true;

    await runningRound.save();

    console.log(`
🎯 ROUND RESULT
Round ID: ${runningRound.roundId}
Number: ${result}
Size: ${size}
Color: ${color}
Total Bets: ${bets.length}
----------------------------------
`);

    if (res) {
      res.json({
        success: true,
        result,
        size,
        color,
        totalBets: bets.length
      });
    }

  } catch (err) {
    if (res) {
      res.status(500).json({ error: err.message });
    }
  }
};