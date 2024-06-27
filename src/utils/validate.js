const fs = require('fs');
const path = require('path');

const validateRequest = (validationSchema) => {
  return (req, res, next) => {
    const validationResult = validationSchema.validate(req.body, { abortEarly: false, convert: false });

    if (validationResult.error) {
      const errors = validationResult.error.details.reduce((acc, errorDetail) => {
        acc[errorDetail.path.join('.')] = errorDetail.message;
        return acc;
      }, {});
      console.error(`Validation error: ${Object.values(errors).join(', ')}`);
      return res.validationError({errors});
    }
    next();
  };
};

module.exports = { validateRequest };