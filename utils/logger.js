const { createLogger, transports, format } = require("winston");

const successLogger = createLogger({
  transports: [
    new transports.File({
      filename: "./logs/success.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

const errorLogger = createLogger({
  transports: [
    new transports.File({
      filename: "./logs/error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { successLogger, errorLogger };
