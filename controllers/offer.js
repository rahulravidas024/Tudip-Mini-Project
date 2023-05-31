const offerModel = require("../models/offer");
const productModel = require("../models/product");
const validation = require("../validations/offer");
const { successLogger, errorLogger } = require("../utils/logger");

exports.createOffer = async (req, res) => {
  try {
    const userId = req.userDetails.userId;
    let role = req.userDetails.role.toLowerCase();

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only admin or superadmin should create offer",
      });
    }

    const { error } = validation.offerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let data = req.body;
    let productId = data.productId;
    data.userId = userId;

    const product = await productModel.findProduct(productId);
    if (!product) {
      return res.status(400).send({ status: false, message: "Product does not exist" });
    }

    const create = await offerModel.createOffer(data);

    successLogger.info("Offer created");
    return res.status(201).send({
      status: true, message: "Offer created successfully", data: create
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getOffer = async (req, res) => {
  try {
    const getData = await offerModel.getOffer();

    if (getData.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved all the offer details");
    return res.status(200).send({ status: true, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    let role = req.userDetails.role.toLowerCase();

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only admin or superadmin should update offer",
      });
    }

    const { error } = validation.offerUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let offerId = req.query.offerId;
    let data = req.body;

    const update = await offerModel.updateOffer(offerId, data);

    successLogger.info("Offer updated");
    return res.status(200).send({ status: true, message: "Offer updated", data: update });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    let role = req.userDetails.role.toLowerCase();

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only admin or superadmin should delete offer",
      });
    }

    let offerId = req.query.offerId;

    const offer = await offerModel.findOffer(offerId);
    if (!offer) {
      return res.status(400).send({ status: false, message: "Offer not found" });
    }

    const deleteOffer = await offerModel.deleteOffer(offerId);

    successLogger.info("Offer deleted");
    return res.status(200).send({ status: true, message: "Offer deleted" });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};
