const { GeneralError } = require("../utils/errors");

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      success: false,
      message: [err.message],
      data: {},
    });
  }

  return res.status(500).json({
    success: false,
    message: [err.message],
    data: {},
  });
};

module.exports = handleErrors;
