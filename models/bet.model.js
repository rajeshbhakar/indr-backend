const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  roundId: {
    type: String,
    required: true
  },

  betType: {
    type: String,
    enum: ["number", "bigSmall", "color"],
    required: true
  },

  betValue: {
    type: String, // e.g. "5" or "Big" or "Red"
    required: true
  },

  amount: {
    type: Number,
    required: true
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

module.exports = mongoose.model("Bet", betSchema);