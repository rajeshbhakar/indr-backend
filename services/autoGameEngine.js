const cron = require("node-cron");
const Round = require("../models/Round");
const { generateResult } = require("../controllers/roundController");

const startAutoGame = () => {

  cron.schedule("*/5 * * * * *", async () => {

    try {
      const runningRound = await Round.findOne({ status: "running" });

      // 🚀 If no running round → create one
      if (!runningRound) {
        await Round.create({
          roundId: "R" + Date.now() + Math.floor(Math.random() * 1000),
          startTime: new Date(),
          status: "running",
          bettingLocked: false
        });

        console.log("🚀 New Round Started");
        return;
      }

      const now = new Date();
      const diffSeconds =
        (now - new Date(runningRound.startTime)) / 1000;

      // 🔒 Lock betting after 50 sec
      if (diffSeconds >= 50 && !runningRound.bettingLocked) {
        runningRound.bettingLocked = true;
        await runningRound.save();
        console.log("🔒 Betting Locked");
      }

      // 🎯 End round after 60 sec
      if (diffSeconds >= 60) {

        console.log("🎯 Ending Round...");

        await generateResult(
          { body: {} },
          { json: () => {} }
        );

        // Immediately start next round
        await Round.create({
          roundId: "R" + Date.now() + Math.floor(Math.random() * 1000),
          startTime: new Date(),
          status: "running",
          bettingLocked: false
        });

        console.log("🚀 Next Round Started");
      }

    } catch (err) {
      console.log("AUTO ENGINE ERROR:", err.message);
    }

  });

};

module.exports = startAutoGame;