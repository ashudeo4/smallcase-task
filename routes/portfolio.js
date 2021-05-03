const express = require("express");

const router = express.Router();
const {
  getPortfolio,
  addPortfolio,
  getReturns,
} = require("../controllers/portfolio");

const { addPortfolioValidation } = require("../utils/validation");
router.post("/", addPortfolioValidation, addPortfolio);

router.get("/", getPortfolio);

router.get("/returns", getReturns);

module.exports = router;
