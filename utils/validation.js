const { check } = require("express-validator");

const addPortfolioValidation = [
  check("tickerSymbol", "Ticker Symbol is required").exists(),

  check("averageBuyPrice", "Average Buy Price is required")
    .exists()
    .isNumeric()
    .withMessage("Average Buy Price should be number"),
  check("shares", "Shares is required")
    .exists()
    .isNumeric()
    .withMessage("Shares should be number"),
];

const tradeBuyValidation = [
  check("tickerSymbol", "Ticker Symbol is required").exists(),

  check("buyPrice", "Buy Price is required")
    .exists()
    .isNumeric()
    .withMessage("Buy Price should be number"),
  check("shares", "Shares is required")
    .exists()
    .isNumeric()
    .withMessage("Shares should be number")
    .isInt({ min: 1 })
    .withMessage("Shares should be greater than zero"),
];

const tradeSellValidation = [
  check("tickerSymbol", "Ticker Symbol is required").exists(),

  check("shares", "Shares is required")
    .exists()
    .isNumeric()
    .withMessage("Shares should be number")
    .isInt({ min: 1 })
    .withMessage("Shares should be greater than zero"),
];
const tradeRemoveValidation = [
  check("id", "Id is required")
    .exists()
    .isMongoId()
    .withMessage("Not a vaild MongoDB Id"),
];

const tradeUpdateValidation = [
  check("id", "Id is required")
    .exists()
    .isMongoId()
    .withMessage("Not a vaild MongoDB Id"),
  check("type", "Type is required")
    .exists()
    .isIn(["BUY", "SELL"])
    .withMessage("Type should be BUY or SELL"),
  check("tickerSymbol", "Ticker Symbol is required").exists(),
  check("shares", "Shares is required")
    .exists()
    .isNumeric()
    .withMessage("Shares should be number")
    .isInt({ min: 1 })
    .withMessage("Shares should be greater than zero"),
];
module.exports = {
  addPortfolioValidation,
  tradeBuyValidation,
  tradeSellValidation,
  tradeRemoveValidation,
  tradeUpdateValidation,
};
