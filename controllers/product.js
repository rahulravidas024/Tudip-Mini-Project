const productModel = require("../models/product");
const config = require("../config/config");
const validation = require("../validations/product");
const { successLogger, errorLogger } = require("../utils/logger");

exports.createProduct = async (req, res) => {
  try {
    const { error } = validation.productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let role = req.userDetails.role.toLowerCase();

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only admin or superadmin should create product",
      });
    }

    let data = req.body;
    let image = req.file;

    imageUrl = `${config.BASE_URL}/Images/${image.filename}`;
    data.image = imageUrl;

    const existingName = await productModel.findName(data.name);
    if (existingName) {
      return res.status(409).send({ status: false, message: "Product name is already taken" });
    }

    const create = await productModel.createProduct(data);

    successLogger.info("Product created");
    return res.status(201).send({
      status: true, message: "Product created successfully", data: create,
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const getProduct = await productModel.getAllProduct();

    if (getProduct.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved all the products");
    return res.status(200).send({
      status: true, totalProduct: getProduct.length, data: getProduct
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { error } = validation.productUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let role = req.userDetails.role.toLowerCase();

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only admin or superadmin should update product",
      });
    }

    const productId = req.params.productId;
    let data = req.body;

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product not found" });
    }

    const existingName = await productModel.findName(data.name);
    if (existingName) {
      return res.status(409).send({ status: false, message: "Product name is already taken" });
    }

    const update = await productModel.updateProduct(productId, data);

    successLogger.info("Product updated");
    return res.status(200).send({ status: true, message: "Product updated", data: update });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const { error } = validation.priceSchema.validate(req.query.price);
    if (error) {
      return res.status(400).send({ status: false, message: "Enter only positive number" });
    }

    let data = req.query;
    data.price = parseInt(req.query.price);

    const getData = await productModel.searchProduct(data);

    if (getData.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully searched the products");
    return res.status(200).send({ status: true, totalProduct: getData.length, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.sortProduct = async (req, res) => {
  try {
    let data = req.query;
    let { name, price } = data;

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
          status: false,
          message: "Please enter 1 for ascending sort and -1 for descending sort",
        });
      }
    }

    const getData = await productModel.sortProduct(data);

    if (getData.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("The products have been successfully sorted");
    return res.status(200).send({ status: true, totalProduct: getData.length, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let role = req.userDetails.role.toLowerCase();

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only admin or superadmin should delete product",
      });
    }

    const productId = req.query.productId;

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product not found" });
    }

    const data = await productModel.deleteProduct(productId);

    successLogger.info("Product deleted successfully");
    return res.status(200).send({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};
