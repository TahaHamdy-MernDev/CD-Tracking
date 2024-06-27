const Joi = require('joi');

const registerValidationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.base': `"username" should be a type of 'text'`,
    'string.empty': `"username" cannot be an empty field`,
    'string.min': `"username" should have a minimum length of {#limit}`,
    'string.max': `"username" should have a maximum length of {#limit}`,
    'any.required': `"username" is a required field`
  }),
  password: Joi.string().min(6).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
    'string.pattern':'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'string.min': `"password" should have a minimum length of {#limit}`,
    'any.required': `"password" is a required field`
  }),
  phoneNumber: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
    'string.length': `"phoneNumber" should have a length of {#limit}`,
    'string.pattern.base': `"phoneNumber" should contain only digits`,
    'any.required': `"phoneNumber" is a required field`
  }),
  companyBranch: Joi.string().required().messages({
    'any.required': `"companyBranch" is a required field`
  })
});

const loginValidationSchema = Joi.object({
  phoneNumber: Joi.string().required().messages({
    'any.required': `"phoneNumber" is a required field`
  }),
  password: Joi.string().required().messages({
    'any.required': `"password" is a required field`
  })
});

module.exports = { loginValidationSchema, registerValidationSchema}
