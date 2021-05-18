const Trade = require("../models/trade");
const Portfolio = require("../models/portfolio");
const { validationResult } = require("express-validator");
const { BadRequest } = require("../utils/errors");
const { successResponse, errorResponse } = require("../utils/response");

//helper function for adding the trade
const addTrade = async (tickerSymbol, shares, type, price) => {
  try {
    await Trade.create({ tickerSymbol, shares, type, price });
  } catch (err) {
    throw new Error(err);
  }
};

//Selling the shares
const sellShares = async (req, res, next) => {
  try {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length) {
      return errorResponse(res, 400, errors);
    }
    const { tickerSymbol } = req.body;
    const portfolioFound = await Portfolio.findOne({ tickerSymbol });
    if (!portfolioFound) {
      throw new BadRequest("Portfoilo not found");
    }

    portfolioFound.shares -= req.body.shares;
    if (portfolioFound.shares < 0) {
      throw new BadRequest("Cannot sell shares");
    }
    await portfolioFound.save();
    await addTrade(
      tickerSymbol,
      req.body.shares,
      "SELL",
      portfolioFound.averageBuyPrice
    );
    return successResponse(
      res,
      200,
      `Sold ${req.body.shares} shares`,
      portfolioFound
    );
  } catch (err) {
    next(err);
  }
};

//Buying the shares
const buyShares = async (req, res, next, update = false) => {
  try {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length) {
      return errorResponse(res, 400, errors);
    }
    const { tickerSymbol } = req.body;
    let portfolioFound = await Portfolio.findOne({ tickerSymbol });
    if (!portfolioFound) {
      portfolioFound = new Portfolio({
        tickerSymbol,
        averageBuyPrice: 0,
        shares: 0,
      });
    }
    if (update && !portfolioFound) {
      throw new BadRequest("Company portfolio not found");
    }
    const currentAverageBuyPrice = portfolioFound.averageBuyPrice;
    const currentShares = portfolioFound.shares;
    let currentSum = currentShares * currentAverageBuyPrice;
    FinalSum = currentSum + req.body.shares * req.body.buyPrice;

    portfolioFound.shares += req.body.shares;
    portfolioFound.averageBuyPrice = FinalSum / portfolioFound.shares;

    await portfolioFound.save();
    await addTrade(tickerSymbol, req.body.shares, "BUY", req.body.buyPrice);
    return successResponse(
      res,
      200,
      `Bought ${req.body.shares} shares`,
      portfolioFound
    );
  } catch (err) {
    next(err);
  }
};

//To get all the trades
const getAllTrades = async (req, res, next) => {
  try {
    const trades = await Trade.find({});
    return res.json(trades);
  } catch (err) {
    next(err);
  }
};

//Rollback for the bought shares
const rollBackBoughtShares = async (
  currentShares,
  currentAverageBuyPrice,
  tradeShares,
  tradePrice,
  companyPortfolio
) => {
  companyPortfolio.averageBuyPrice =
    (currentAverageBuyPrice * currentShares - tradeShares * tradePrice) /
    (currentShares - tradeShares);
  companyPortfolio.shares = currentShares - tradeShares;
  await companyPortfolio.save();
};

//Rollback for the sold shares
const rollBackSoldShares = async (companyPortfolio, tradeFound) => {
  companyPortfolio.shares += tradeFound.shares;
  await companyPortfolio.save();
};

//For removing any specific trade and rollbacking
const removeTrade = async (req, res, next) => {
  try {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length) {
      return errorResponse(res, 400, errors);
    }
    const { id } = req.body;
    const tradeFound = await Trade.findOne({ _id: id });
    if (!tradeFound) {
      throw new BadRequest("Trade not found");
    }
    const companyPortfolio = await Portfolio.findOne({
      tickerSymbol: tradeFound.tickerSymbol,
    });
    if (!companyPortfolio) {
      throw new BadRequest("Portfolio for company not found");
    }
    if (tradeFound.type === "BUY") {
      await rollBackBoughtShares(
        companyPortfolio.shares,
        companyPortfolio.averageBuyPrice,
        tradeFound.shares,
        tradeFound.price,
        companyPortfolio
      );
    } else {
      await rollBackSoldShares(companyPortfolio, tradeFound);
    }
    await Trade.deleteOne({ _id: id });
    return successResponse(res, 200, "Successfully removed the trade", {});
  } catch (err) {
    next(err);
  }
};

//For updating the trade with rollbacking
const updateTrade = async (req, res, next) => {
  try {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length) {
      return errorResponse(res, 400, errors);
    }
    const { id, type } = req.body;
    const tradeFound = await Trade.findOne({ _id: id });
    if (!tradeFound) {
      throw new BadRequest("Trade not found");
    }
    const companyPortfolio = await Portfolio.findOne({
      tickerSymbol: tradeFound.tickerSymbol,
    });
    if (!companyPortfolio) {
      throw new BadRequest("Portfolio for company not found");
    }
    if (!type) {
      throw new BadRequest("Type is required");
    } else {
      if (type === "BUY") {
        if (!req.body.buyPrice) {
          throw new BadRequest("Buy Price is required");
        }
      }
    }
    if (tradeFound.type === "BUY") {
      await rollBackBoughtShares(
        companyPortfolio.shares,
        companyPortfolio.averageBuyPrice,
        tradeFound.shares,
        tradeFound.price,
        companyPortfolio
      );
    } else {
      await rollBackSoldShares(companyPortfolio, tradeFound);
    }
    await Trade.deleteOne({ _id: req.body.id });
    if (type === "SELL") {
      return await sellShares(req, res, next);
    }
    if (type === "BUY") {
      return await buyShares(req, res, next, true);
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  buyShares,
  sellShares,
  getAllTrades,
  removeTrade,
  updateTrade,
};
