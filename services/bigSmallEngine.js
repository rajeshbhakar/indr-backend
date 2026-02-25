const GameHistory = require("../models/gamehistory.model");
const User = require("../models/user.model");

let currentRound = 1;
let timer = 30;

const getTimer = () => timer;
const getRound = () => currentRound;

const runGame = async () => {

    setInterval(async () => {

        timer--;

        if (timer <= 0) {

            const number = Math.floor(Math.random() * 10) + 1;
            const result = number <= 5 ? "small" : "big";

            console.log("ROUND:", currentRound, "RESULT:", result, "NUMBER:", number);

            global.lastResult = result;
global.lastNumber = number;


            // 🔥 pending bets nikalo (GameHistory se)
            const bets = await GameHistory.find({
                game: "bigsmall",
                roundId: currentRound,
                status: "pending"
            });

            for (let bet of bets) {

  let isWinner = false;
  let multiplier = 0;

  // 🎯 Number Bet
  if (bet.betType === "number" && Number(bet.betValue) === result) {
    isWinner = true;
    multiplier = 9;
  }

  // 🔵 Big Small Bet
  if (bet.betType === "bigSmall" && bet.betValue === size) {
    isWinner = true;
    multiplier = 2;
  }

  // 🎨 Color Bet
  if (bet.betType === "color" && bet.betValue === color) {
    isWinner = true;
    multiplier = (color === "Violet") ? 4 : 2;
  }

  if (isWinner) {

    const winAmount = bet.amount * multiplier;

    // 💰 4% Commission
    const commissionAmount = winAmount * 0.04;
    const finalPayout = winAmount - commissionAmount;

    bet.status = "won";
    bet.winAmount = finalPayout;

    // 💳 Update User Wallet
    const user = await User.findById(bet.userId);
    if (user) {
      user.wallet += finalPayout;
      await user.save();
    }

    // 🏦 Save Commission Record
    await Commission.create({
      roundId: runningRound.roundId,
      betId: bet._id,
      userId: bet.userId,
      commissionAmount: commissionAmount
    });

  } else {
    bet.status = "lost";
    bet.winAmount = 0;
  }

  await bet.save();
}

            currentRound++;
            timer = 30;
        }

    }, 1000);
};

module.exports = { runGame, getTimer, getRound };
