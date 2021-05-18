const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  tickerSymbol: {
    type: String,
  },
  shares: {
    type: Number,
    min: 0,
  },
  price: {
    type: Number,
  },
  type: {
    type: String,
    enum: ["BUY", "SELL"],
    default: "BUY",
  },
});

module.exports = mongoose.model("Trade", tradeSchema);
