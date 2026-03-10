const GameHistory = require("../models/gamehistory.model");
const User = require("../models/user.model");
const Round = require("../models/Round");
const { getTimer } = require("../services/gameEngine");


/* ================= PLACE BET ================= */

exports.placeBet = async (req, res) => {

  try {

    const { amount, choice } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.json({
        success: false,
        msg: "Invalid bet amount"
      });
    }

    if (!["big","small"].includes(choice)) {
      return res.json({
        success: false,
        msg: "Invalid choice"
      });
    }

    if (getTimer() <= 5) {
      return res.json({
        success:false,
        msg:"Betting closed for this round"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success:false,
        msg:"User not found"
      });
    }

    if (user.coins < amount) {
      return res.json({
        success:false,
        msg:"Insufficient balance"
      });
    }

    user.coins -= Number(amount);
    await user.save();

    const runningRound = await Round.findOne({ status:"running" });

    const bet = await GameHistory.create({
      userId,
      game:"bigsmall",
      amount,
      choice,
      winAmount:0,
      status:"pending",
      roundId: runningRound ? runningRound.roundId : null
    });

    res.json({
      success:true,
      msg:"Bet placed successfully",
      bet,
      remainingCoins:user.coins
    });

  } catch (err) {

    res.json({
      success:false,
      msg:err.message
    });

  }

};


/* ================= GET HISTORY ================= */

exports.getHistory = async (req,res) => {

  try {

    const history = await GameHistory.find({
      userId:req.user.id
    })
    .sort({ createdAt:-1 })
    .limit(10);

    res.json({
      success:true,
      history
    });

  } catch(err){

    res.json({
      success:false,
      msg:err.message
    });

  }

};


/* ================= GAME STATUS ================= */

exports.getGameStatus = async (req,res)=>{

  try{

    const runningRound = await Round.findOne({ status:"running" });

    const lastRound = await Round.findOne({ status:"ended" })
    .sort({ endTime:-1 });

    res.json({
      success:true,
      round: runningRound ? runningRound.roundId : null,
      timer: getTimer(),
      lastResult: lastRound ? lastRound.result : null,
      lastNumber: lastRound ? lastRound.result : null
    });

  }catch(err){

    res.json({
      success:false,
      msg:err.message
    });

  }

};