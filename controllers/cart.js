const cartModel = require("../models/cart");
const productModel = require("../models/product");
const { successLogger, errorLogger } = require("../utils/logger");

exports.createCart = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    let productId = req.query.productId;

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product not found" });
    }

    const cartData = await cartModel.findCart(userId);

    if (!cartData) {
      let filter = {};
      filter.userId = userId;

      const itemsArray = [];
      itemsArray.push({ productId: productId, quantity: 1 });

      filter.items = itemsArray;
      filter.totalPrice = product.price;
      filter.totalItems = itemsArray.length;

      const create = await cartModel.createCart(filter);

      successLogger.info("Product added successfully in the cart");
      return res.status(200).send({
        status: true,
        message: "Product added successfully in the cart",
        data: create,
      });
    }

    const productIdList = cartData.items.map((x) => x.productId.toString());

    if (productIdList.includes(productId)) {
      const update = await cartModel.updateIfProductExist(userId, productId, product);

      successLogger.info("Product added successfully in the cart");
      return res.status(200).send({
        status: true,
        message: "Product added successfully in the cart",
        data: update,
      });
    } else {
      const update = await cartModel.updateIfProductNotExist(userId, productId, product);

      successLogger.info("Product added successfully in the cart");
      return res.status(200).send({
        status: true,
        message: "Product added successfully in the cart",
        data: update,
      });
    }
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.userDetails.userId;

    const cart = await cartModel.findCart(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ status: false, message: "Cart is empty" });
    }

    const getData = await cartModel.getCart(userId);
    if (getData == null) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved all the cart details");
    return res.status(200).send({
      status: true,
      totalItems: getData.items.length,
      data: getData,
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    const productId = req.query.productId;
    const incrementQuantity = parseInt(req.query.incrementQuantity);
    const decrementQuantity = parseInt(req.query.decrementQuantity);

    if (!productId) {
      return res.status(400).send({ status: false, message: "Invalid product ID" });
    }

    if (isNaN(incrementQuantity || decrementQuantity) ||
      incrementQuantity <= 0 || decrementQuantity <= 0
    ) {
      return res.status(400).send({
        status: false, message: "Invalid quantity, please enter number",
      });
    }

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product not found" });
    }

    const cart = await cartModel.findCart(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ status: false, message: "Cart is empty" });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(400).send({ status: false, message: "Product does not exist in cart" });
    }

    const cartItem = cart.items[itemIndex];

    if (incrementQuantity) {
      const updatedPrice = incrementQuantity * product.price;

      const update = await cartModel.incrementQuantity(userId, productId, incrementQuantity, updatedPrice);

      successLogger.info("Product quantity incremented successfully");
      return res.status(200).send({
        status: true,
        message: "Product quantity incremented successfully",
        data: update,
      });
    }

    if (decrementQuantity) {
      const updatedPrice = decrementQuantity * product.price;

      if (cartItem.quantity == 1) {
        const update = await cartModel.removeProduct(userId, productId, product);
        successLogger.info("Product removed");
        return res
          .status(200)
          .send({ status: true, message: "Product removed", data: update });
      }

      const update = await cartModel.decrementQuantity(userId, productId, decrementQuantity, updatedPrice);

      successLogger.info("Product quantity decremented successfully");
      return res.status(200).send({
        status: true,
        message: "Product quantity decremented successfully",
        data: update,
      });
    }
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.sortCartProduct = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    const { name, price } = req.query;

    if (name) {
      if (name != "1" && name != "-1") {
        return res.status(400).send({
          status: false, message: "Please enter 1 for ascending sort and -1 for descending sort",
        });
      }
    }

    if (price) {
      if (price != "1" && price != "-1") {
        return res.status(400).send({
          status: false, message: "Please enter 1 for ascending sort and -1 for descending sort",
        });
      }
    }

    const cart = await cartModel.findCart(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ status: false, message: "Cart is empty" });
    }

    const getData = await cartModel.sortCartProduct(userId);

    if (name == "1") {
      getData.items.sort((a, b) => {
        const nameA = a.productId.name.toLowerCase();
        const nameB = b.productId.name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    if (name == "-1") {
      getData.items.sort((a, b) => {
        const nameA = a.productId.name.toLowerCase();
        const nameB = b.productId.name.toLowerCase();
        return nameB.localeCompare(nameA);
      });
    }

    if (price == "1") {
      getData.items.sort((a, b) => a.productId.price - b.productId.price);
    }

    if (price == "-1") {
      getData.items.sort((a, b) => b.productId.price - a.productId.price);
    }

    successLogger.info("The cart have been successfully sorted");
    return res.status(200).send({
      status: true,
      totalItems: getData.items.length,
      data: getData,
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.searchProductInCart = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    let { name, city } = req.query;

    const cart = await cartModel.findCart(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ status: false, message: "Cart is empty" });
    }

    const getProduct = await cartModel.searchProductInCart(userId, name, city);

    if (getProduct.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully searched the cart details");
    return res.status(200).send({
      status: true,
      totalProduct: getProduct.length,
      data: getProduct,
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const userId = req.userDetails.userId;

    const cart = await cartModel.findCart(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ status: false, message: "Cart is empty" });
    }

    const data = await cartModel.deleteCart(userId);

    successLogger.info("The cart has been emptied successfully");
    return res.status(200).send({
      status: true,
      data: "The cart has been emptied successfully",
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};
