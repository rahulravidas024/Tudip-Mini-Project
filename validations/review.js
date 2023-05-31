const Joi = require("joi");

exports.reviewSchema = Joi.object({
  productId: Joi.string().required(),
  rating: Joi.number().required(),
  review: Joi.string().optional(),
}).unknown(false);
