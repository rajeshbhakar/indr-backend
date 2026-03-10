const Round = require("../models/Round");
const { generateResult } = require("../controllers/roundController");

let timer = 30;

exports.getTimer = () => timer;

/* ================= START ROUND ================= */

async function createNewRound(){

  const existingRound = await Round.findOne({ status:"running" });

  if(existingRound) return;

  const roundId = "R" + Date.now();

  await Round.create({
    roundId,
    startTime:new Date(),
    status:"running",
    bettingLocked:false
  });

  console.log("🟢 New Round Started:", roundId);

}

createNewRound();

/* ================= GAME LOOP ================= */

setInterval(async () => {

  timer--;

  if(timer === 5){

    console.log("🔒 Betting Locked");

    const runningRound = await Round.findOne({ status:"running" });

    if(runningRound){
      runningRound.bettingLocked = true;
      await runningRound.save();
    }

  }

  if(timer === 0){

    await generateResult();

    timer = 30;

    await createNewRound();

  }

},1000);