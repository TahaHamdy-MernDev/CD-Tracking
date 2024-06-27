const { responseBody } = require(".");
const { responseCode } = require("../../constants/responseConstants");

/**
 *
 * @param {obj} req : request from controller.
 * @param {obj} res : response from controller.
 * @param {*} next : executes the middleware succeeding the current middleware.
 */
const responseHandler = (req, res, next) => {
  res.success = (data) => {
    res.status(responseCode.success).json(responseBody.success(data));
  };
  res.badRequest = (data) => {
    res.status(responseCode.badRequest).json(responseBody.badRequest(data));
  };
  res.internalServerError = (data) => {
    res.status(responseCode.internalServerError).json(responseBody.internalServerError(data));
  };
  res.recordNotFound = (data) => {
    res.status(responseCode.recordNotFound).json(responseBody.recordNotFound(data));
  };
  res.conflict = (data) => {
    res.status(responseCode.conflict).json(responseBody.conflict(data));
  };
  res.validationError = (data) => {
    res.status(responseCode.validationError).json(responseBody.validationError(data));
  };
  res.unAuthorized = (data) => {
    res.status(responseCode.unAuthorized).json(responseBody.unAuthorized(data));
  };
  next();
};

module.exports = responseHandler;
