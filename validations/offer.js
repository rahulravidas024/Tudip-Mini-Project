const Joi = require("joi");

exports.offerSchema = Joi.object({
  name: Joi.string().required(),
  productId: Joi.string().required(),
  quantity: Joi.number().default(1),
  title: Joi.string(),
  claimedCount: Joi.number().default(1),
  pointsPerOffer: Joi.number().default(1),
}).unknown(false);

exports.offerUpdateSchema = Joi.object({
  name: Joi.string(),
  productId: Joi.string(),
  quantity: Joi.number(),
  title: Joi.string(),
  claimedCount: Joi.number(),
  pointsPerOffer: Joi.number(),
}).unknown(false);
