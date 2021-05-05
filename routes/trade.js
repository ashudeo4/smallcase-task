const express = require("express");

const router = express.Router();
const {
  buyShares,
  sellShares,
  getAllTrades,
  removeTrade,
  updateTrade,
} = require("../controllers/trade");

const {
  tradeBuyValidation,
  tradeSellValidation,
  tradeRemoveValidation,
  tradeUpdateValidation,
} = require("../utils/validation");

//For getting the trades
router.get("/", getAllTrades);

//for buying shares
router.post("/buy", tradeBuyValidation, buyShares);

//for selling shares
router.post("/sell", tradeSellValidation, sellShares);

//for deleting a specific trade
router.delete("/", tradeRemoveValidation, removeTrade);

//for updating the trade
router.put("/", tradeUpdateValidation, updateTrade);

module.exports = router;
