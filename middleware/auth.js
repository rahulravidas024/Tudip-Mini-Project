const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { successLogger, errorLogger } = require("../utils/logger");

exports.authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ status: false, message: "Please provide token" });
    }

    token = token.split(" ")[1];

    jwt.verify(token, config.secretKey, (error, decodedToken) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          errorLogger.error("Token has expired");
          return res.status(401).send({ message: "Token has expired" });
        }

        errorLogger.error("User is unauthorized or token is invalid");
        return res.status(401).send({
          status: false, message: "User is unauthorized or token is invalid",
        });
      } else {
        res.setHeader("x-api-key", token);
        req.userDetails = decodedToken;
        next();
      }
    });
  } catch (error) {
    errorLogger.error(error.message);
    return res.status(400).send({ status: false, message: error.message });
  }
};
