const mongoose = require("mongoose");

const gameHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    game: {
      type: String,
      default: "bigsmall",
    },

    amount: Number,

    choice: String,

    winAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "win", "lose"],
      default: "pending",
    },

    roundId: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameHistory", gameHistorySchema);
