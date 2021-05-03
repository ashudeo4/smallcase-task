const successResponse = (res, statusCode, message, payload) => {
  return res.status(statusCode).json({ success: true, message, data: payload });
};

const errorResponse = (res, statusCode, message) => {
  const errors = [];
  for (let error in message) {
    errors.push(message[error].msg);
  }
  return res
    .status(statusCode)
    .json({ success: false, message: errors, data: {} });
};
module.exports = { successResponse, errorResponse };
