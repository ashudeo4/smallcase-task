const { successResponse } = require("../utils/response");
const getIndex = (req, res, next) => {
  try {
    return successResponse(res, 200, "got the data", { msg: "hello" });
    // res.status(200).json({ msg: "hello" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getIndex,
};
