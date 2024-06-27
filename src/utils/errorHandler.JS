function errorHandler(error, req, res, next) {
    return res.internalServerError({ data: { message: error.message } });
  }
  
  module.exports = { errorHandler };
  