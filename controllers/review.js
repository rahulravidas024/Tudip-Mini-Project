const reviewModel = require("../models/review");
const productModel = require("../models/product");
const { reviewSchema } = require("../validations/review");
const { successLogger, errorLogger } = require("../utils/logger");

exports.createReview = async (req, res) => {
  try {
    const userId = req.userDetails.userId;

    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let data = req.body;
    let { productId, rating, review } = data;

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product does not exist" });
    }

    const isProductExist = await reviewModel.isProductExistInReview(productId);
    if (isProductExist) {
      return res.status(400).send({
        status: true, message: "A user can only give one review for one product"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).send({ status: false, message: "Please enter rating between 1 to 5", });
    }

    const obj = {};

    obj.userId = userId;
    obj.productId = productId;
    obj.rating = rating;
    obj.review = review;

    const create = await reviewModel.createReview(obj);

    successLogger.info("Review created");
    return res.status(201).send({
      status: true, message: "Thank you for your feedback", data: create
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getReview = async (req, res) => {
  try {
    const userId = req.userDetails.userId;

    const getData = await reviewModel.getReview(userId);

    if (getData.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved all the reviews");
    return res.status(200).send({ status: true, totalProductReviewed: getData.length, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const userId = req.userDetails.userId;

    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let data = req.body;
    let { productId, rating, review } = data;

    const isProductExist = await reviewModel.isProductExistInReview(productId);
    if (!isProductExist) {
      return res.status(400).send({ status: true, message: "This product review is not availabe" });
    }

    const update = await reviewModel.updateReview(userId, productId, rating, review);

    successLogger.info("Review updated");
    return res.status(200).send({
      status: true, message: "Review updated, thank you for your feedback", data: update
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    const productId = req.query.productId;

    const isProductExist = await reviewModel.isProductExistInReview(productId);
    if (!isProductExist) {
      return res.status(400).send({ status: true, message: "This product review is not availabe" });
    }

    const deleteData = await reviewModel.deleteRevew(userId, productId);

    successLogger.info("Review deleted");
    return res.status(200).send({ status: true, message: "Review deleted" });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};
