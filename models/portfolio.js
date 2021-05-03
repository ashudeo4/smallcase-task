const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  tickerSymbol: {
    type: String,
    unique: true,
    index: true,
  },
  averageBuyPrice: {
    type: Number,
    min: 0,
  },
  shares: {
    type: Number,
    min: 0,
  },
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
