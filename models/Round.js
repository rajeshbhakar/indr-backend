const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  roundId: {
    type: String,
    required: true,
    unique: true
  },

  startTime: {
    type: Date,
    default: Date.now
  },

  endTime: {
    type: Date
  },

  status: {
    type: String,
    enum: ["running", "ended"],
    default: "running"
  },

  result: {
    type: Number,
    default: null
  },

  totalPool: {
    type: Number,
    default: 0
  },

  
  bettingLocked: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Round", roundSchema);