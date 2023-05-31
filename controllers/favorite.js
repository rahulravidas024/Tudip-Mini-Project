const userModel = require("../models/user");
const productModel = require("../models/product");
const { successLogger, errorLogger } = require("../utils/logger");

exports.addFavoriteProduct = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    const productId = req.query.productId;

    const user = await userModel.findUser(userId);

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product not found", });
    }

    if (user.favoriteProducts.includes(productId)) {
      return res.status(409).send({ status: false, message: "Product already marked as favorite" });
    }

    const addFavorite = await userModel.addFavoriteProduct(userId, product);

    successLogger.info("Product added to favorites");
    return res.status(200).send({
      status: true,
      message: "Product added to favorites",
      data: addFavorite,
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getAllFavoriteProduct = async (req, res) => {
  try {
    const userId = req.userDetails.userId;

    const getProduct = await userModel.getAllFavoriteProduct(userId);

    if (getProduct.favoriteProducts.length == 0) {
      return res.status(404).send({ status: false, message: "Favorite product list is empty", });
    }

    successLogger.info("Successfully retrieved all favorite products");
    return res.status(200).send({
      status: true,
      totalFavoriteProduct: getProduct.favoriteProducts.length,
      data: getProduct.favoriteProducts,
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.removeFavoriteProduct = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    const productId = req.query.productId;

    const user = await userModel.findUser(userId);

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product not found" });
    }

    if (!user.favoriteProducts.includes(productId)) {
      return res.status(400).send({ status: false, message: "Product not found in favorites", });
    }

    const removeProduct = await userModel.removeFavoriteProduct(userId, productId);

    successLogger.info("Favorite product removed");
    return res.status(200).send({ status: true, message: "Favorite product removed" });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};
