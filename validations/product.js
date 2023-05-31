const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  image: Joi.string().default("No image"),
}).unknown(false);

exports.productUpdateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  image: Joi.string(),
}).unknown(false);

exports.priceSchema = Joi.number().positive().integer();
