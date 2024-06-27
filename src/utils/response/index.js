const { responseMessages, responseCode, responseStatus } = require("../../constants/responseConstants");

const responseData = (data) => (data && Object.keys(data).length ? data : null);

exports.responseBody = {
  success: (data = {}) => ({
    status: responseStatus.success,
    code: responseCode.success,
    message: data.message || responseMessages.success,
    data: responseData(data.data),
  }),
  badRequest: (data = {}) => ({
    status: responseStatus.badRequest,
    code: responseCode.badRequest,
    message: data.message || responseMessages.badRequest,
    data: responseData(data.data),
  }),

  recordNotFound: (data = {}) => ({
    status: responseStatus.recordNotFound,
    code: responseCode.recordNotFound,
    message: data.message || responseMessages.recordNotFound,
    route: data.routeMessage,
    data: responseData(data.data),
  }),
  conflict: (field, data = {}) => ({ 
    status: responseStatus.conflict,
    code: responseCode.conflict,
    message: data.message || responseMessages.conflict(field),
    data: responseData(data.data),
  }),
  validationError: (data = {}) => ({
    status: responseStatus.validationError,
    code: responseCode.validationError,
    message: data.message || responseMessages.validationError,
    errors: data.errors || {},
    data: responseData(data.data),
  }),
  unAuthorized: (data = {}) => ({
    status: responseStatus.unauthorized,
    code: responseCode.unAuthorized,
    message: data.message || responseMessages.unauthorized,
    data: responseData(data.data),
  }),
  internalServerError: (data = {}) => ({
    status: responseStatus.serverError,
    code: responseCode.internalServerError,
    message: data.message || responseMessages.internalServerError,
    stack: data.stack,
    data: responseData(data.data),
  }),
};
