const express = require("express");

const router = express.Router();
const {
  getPortfolio,
  addPortfolio,
  getReturns,
} = require("../controllers/portfolio");

const { addPortfolioValidation } = require("../utils/validation");

//For adding portfolio
router.post("/", addPortfolioValidation, addPortfolio);

//For getting the portfolio
router.get("/", getPortfolio);

//For getting the returns
router.get("/returns", getReturns);

module.exports = router;
