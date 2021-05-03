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

router.get("/", getAllTrades);

router.post("/buy", tradeBuyValidation, buyShares);

router.post("/sell", tradeSellValidation, sellShares);

router.delete("/", tradeRemoveValidation, removeTrade);

router.put("/", tradeUpdateValidation, updateTrade);

module.exports = router;
