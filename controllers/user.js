const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const config = require("../config/config");
const validation = require("../validations/user");
const { sendMail } = require("../services/sendMail");
const { successLogger, errorLogger } = require("../utils/logger");

exports.createUser = async (req, res) => {
  try {
    const { error } = validation.userSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let data = req.body;
    let password = data.password;

    const existingEmail = await userModel.findEmail(data.email);
    if (existingEmail) {
      return res.status(409).send({ status: false, message: "Email is already taken" });
    }

    const existingPhone = await userModel.findMobileNumber(data.mobileNumber);
    if (existingPhone) {
      return res.status(409).send({ status: false, message: "Mobile number is already taken" });
    }

    const salt = await bcrypt.genSalt(config.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);
    data.password = hashedPassword;

    const create = await userModel.createUser(data);

    sendMail(create.name, create.email, create._id.toString());

    successLogger.info("User created successfully");
    return res.status(201).send({
      status: true, message: "User created successfully", data: create,
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getALlUser = async (req, res) => {
  try {
    const getUser = await userModel.getALlUser();

    if (getUser.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved all the user details");
    return res.status(200).send({ status: true, totalUser: getUser.length, data: getUser });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getUserByQueryString = async (req, res) => {
  try {
    let userId = req.query.userId;

    const getData = await userModel.getUserByQueryString(userId);

    if (getData == null) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved the user details");
    return res.status(200).send({ status: true, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getUserByQueryParams = async (req, res) => {
  try {
    let userId = req.params.userId;

    const getData = await userModel.getUserByQueryParams(userId);

    if (getData == null) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved the user details");
    return res.status(200).send({ status: true, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getUserByLimit = async (req, res) => {
  try {
    const { error } = validation.limitSchema.validate(req.query.limit);
    if (error) {
      return res.status(400).send({ status: false, message: "Enter only positive number" });
    }

    let limit = parseInt(req.query.limit);

    const getData = await userModel.getUserByLimit(limit);

    if (getData.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully retrieved the user details");
    return res.status(200).send({ status: true, TotalUser: getData.length, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { error } = validation.userUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).send({ errors: validationErrors });
    }

    let role = req.userDetails.role.toLowerCase();
    const userId = req.params.userId;

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only superadmin or admin should update user",
      });
    }

    const user = await userModel.findUser(userId);
    if (!user) {
      return res.status(400).send({ status: false, message: "User not found" });
    }

    if (userId != req.userDetails.userId) {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed; You are not authorised person ",
      });
    }

    let data = req.body;

    const existingEmail = await userModel.findEmail(data.email);
    if (existingEmail) {
      return res.status(409).send({ status: false, message: "Email is already taken" });
    }

    const existingPhone = await userModel.findMobileNumber(data.mobileNumber);
    if (existingPhone) {
      return res.status(409).send({ status: false, message: "Mobile number is already taken" });
    }

    const update = await userModel.updateUser(data, userId);

    successLogger.info("User updated");
    return res.status(200).send({ status: true, message: "User updated", data: update });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let role = req.userDetails.role.toLowerCase();
    const userId = req.params.userId;

    if (role != "admin" && role != "superadmin") {
      return res.status(403).send({
        status: false,
        message: "Authorisation failed, only superadmin or admin should delete user",
      });
    }

    const user = await userModel.findUser(userId);
    if (!user) {
      return res.status(400).send({ status: false, message: "User not found" });
    }

    const deleteUser = await userModel.deleteUser(userId);

    successLogger.info("User deleted");
    return res.status(200).send({ status: true, message: "User deleted" });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.getFilteredUser = async (req, res) => {
  try {
    let data = req.query;

    const getData = await userModel.getFilteredUser(data);

    if (getData.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }

    successLogger.info("Successfully filtered the user details");
    return res.status(200).send({ status: true, totalUser: getData.length, data: getData });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = validation.emailSchema.validate(req.body.email);
    if (error) {
      return res.status(400).send({ status: false, message: "Enter valid email" });
    }

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).send({ status: false, message: "Please provide email and password" });
    }

    const loginUser = await userModel.findEmail(email);
    if (!loginUser) {
      return res.status(401).send({ status: false, message: "Email or password is incorrect" });
    }

    const checkPassword = await bcrypt.compare(password, loginUser.password);
    if (!checkPassword) {
      return res.status(401).send({ status: false, message: "Email or password is incorrect" });
    }

    const token = jwt.sign(
      { userId: loginUser._id.toString(), role: loginUser.role },
      config.secretKey, { expiresIn: config.Token_Expiry }
    );

    successLogger.info("Login successful");
    return res.status(200).send({ status: true, message: "Login successful", token: token });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const userId = req.params.userId;

    const verify = await userModel.verifyEmail(userId);

    successLogger.info("User email verified successfully");
    return res.status(200).send("User email verified successfully");
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};
