const Portfolio = require("../models/portfolio");
const { BadRequest } = require("../utils/errors");
const { validationResult } = require("express-validator");
const { successResponse, errorResponse } = require("../utils/response");

//Get the portfolios
const getPortfolio = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({});
    let finalAverageBuyPrice = 0;
    let finalShares = 0;
    for (portfolio of portfolios) {
      finalAverageBuyPrice += portfolio.averageBuyPrice;
      finalShares += portfolio.shares;
    }
    return successResponse(res, 200, "All portfolios", {
      finalAverageBuyPrice,
      finalShares,
      portfolios,
    });
  } catch (err) {
    next(err);
  }
};

//Adding the portfolio
const addPortfolio = async (req, res, next) => {
  try {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length) {
      return errorResponse(res, 400, errors);
    }
    const { tickerSymbol } = req.body;

    const tickerFound = await Portfolio.findOne({ tickerSymbol });
    if (tickerFound) throw new BadRequest("Ticker found");

    const savedPortfolio = await Portfolio.create(req.body);
    return successResponse(res, 201, "Portfolio added", savedPortfolio);
  } catch (err) {
    next(err);
  }
};

//Get the returns
const getReturns = async (req, res, next) => {
  try {
    let todayPrice = 100;
    const portfolios = await Portfolio.find();
    let returns = 0;

    for (let portfolio of portfolios) {
      returns += (todayPrice - portfolio.averageBuyPrice) * portfolio.shares;
    }

    return successResponse(res, 200, "Returns of the portfolios", { returns });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPortfolio,
  addPortfolio,
  getReturns,
};
