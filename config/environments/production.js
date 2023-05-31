require("dotenv").config();

module.exports = {
  port: process.env.PORT || 8080,
  secretKey: process.env.SECRET_KEY,
  Token_Expiry: process.env.Token_Expiry || "5m",
  BASE_URL: process.env.BASE_URL || "http://localhost:8080",
  SALT_ROUND: parseInt(process.env.SALT_ROUND) || 5,

  database: {
    db_protocol: process.env.db_protocol || "mongodb",
    db_user: process.env.db_user || "",
    db_pass: process.env.db_pass || "",
    db_host: process.env.db_host || "localhost:27017",
    db_name: process.env.db_name || "defaultProject",
  },

  smtp_server: {
    SMTP_HOST: process.env.SMTP_HOST || "smtp.ethereal.email",
    SMPT_PORT: process.env.SMPT_PORT || 587,
    SMTP_SECURE: JSON.parse(process.env.SMTP_SECURE) || false,
    SMTP_USER: process.env.SMTP_USER || "destinee28@ethereal.email",
    SMTP_PASS: process.env.SMTP_PASS || "fqB1X5dz4XsqetBMY4",
  },
};