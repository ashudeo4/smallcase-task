const { successResponse } = require("../utils/response");
const getIndex = (req, res, next) => {
  try {
    return successResponse(res, 200, "API are working", {});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getIndex,
};
