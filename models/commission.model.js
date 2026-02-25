const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  roundId: String,
  betId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bet"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  commissionAmount: Number
}, { timestamps: true });

module.exports = mongoose.model("Commission", commissionSchema);    