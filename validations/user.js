const Joi = require("joi");

exports.userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .lowercase()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(15)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/
    )
    .message(
      "The password should be 6 to 15 characters long and must include at least one uppercase letter, one lowercase letter, and one special character"
    ),
  gender: Joi.string().required().valid("male", "female", "other"),
  mobileNumber: Joi.number()
    .integer()
    .required()
    .positive()
    .min(1000000000)
    .max(9999999999)
    .message("Mobile number must be a 10-digit number"),
  pincode: Joi.number()
    .integer()
    .positive()
    .min(100000)
    .max(999999)
    .message("Pincode must be a 6-digit number"),
  address: Joi.string(),
  role: Joi.string().lowercase().required(),
  isActive: Joi.boolean().required().default(false).valid(true, false),
  isVerified: Joi.boolean().default(false).valid(true, false),
}).unknown(false);

exports.userUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string()
    .lowercase()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
    }),
  password: Joi.string()
    .min(6)
    .max(15)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/
    )
    .message(
      "The password should be 6 to 15 characters long and must include at least one uppercase letter, one lowercase letter, and one special character"
    ),
  gender: Joi.string().valid("male", "female", "other"),
  mobileNumber: Joi.number()
    .integer()
    .positive()
    .min(1000000000)
    .max(9999999999)
    .message("Mobile number must be a 10-digit number"),
  pincode: Joi.number()
    .integer()
    .positive()
    .min(100000)
    .max(999999)
    .message("Pincode must be a 6-digit number"),
  address: Joi.string(),
  role: Joi.string().lowercase(),
  isActive: Joi.boolean().default(false).valid(true, false),
  isVerified: Joi.boolean().default(false).valid(true, false),
}).unknown(false);

exports.limitSchema = Joi.number().positive().integer();

exports.emailSchema = Joi.string()
  .lowercase()
  .required()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "in"] },
  });
