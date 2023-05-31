const config = require("../config/config");
const nodemailer = require("nodemailer");
const { successLogger, errorLogger } = require("../utils/logger");

exports.sendMail = async (name, email, userId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp_server.SMTP_HOST,
      port: config.smtp_server.SMPT_PORT,
      secure: config.smtp_server.SMTP_SECURE,
      auth: {
        user: config.smtp_server.SMTP_USER,
        pass: config.smtp_server.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: config.smtp_server.SMTP_USER,
      to: email,
      subject: "Welcome! Thank you for signing up",
      html: `<p style="font-size: 14px;"><b>Hi ${name}</b>, <br> Thank you so much for joining! To complete the sign-up process, we kindly request you to confirm that we have your email address correctly. <br><br><a href='${config.BASE_URL}/user/verifyEmail/${userId}' style="display: inline-block; padding: 10px 20px; background-color: #D13639; color: white; text-decoration: none; border-radius: 5px;"><b>Confirm your email</b></a><br><br> If you received this email by mistake, simply delete it. <br><br> For questions about this list, please contact: <br> companyinfo@gmail.com  </p>`,
    });

    transporter.sendMail(info, (info, error) => {
      if (info) {
        successLogger.info("Email has been send");
      } else {
        errorLogger.error(error);
      }
    });
  } catch (error) {
    errorLogger.error(error.message);
    console.log(error);
  }
};
