const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  roundId: {
    type: String,
    required: true,
    index: true
  },

  betType: {
    type: String,
    enum: ["number", "bigSmall", "color"],
    required: true
  },

  betValue: {
    type: String,
    required: true,
    trim: true
  },

  amount: {
    type: Number,
    required: true,
    min: 1
  },

  status: {
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending"
  },

  winAmount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

/* ============================= */
/* Prevent duplicate bets spam   */
/* ============================= */

betSchema.index({ userId:1, roundId:1 });

module.exports = mongoose.model("Bet", betSchema);