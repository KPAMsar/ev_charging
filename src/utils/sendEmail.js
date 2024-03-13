// const image = require('./legumes.jpg')
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// const smtpTransport = require('nodemailer-smtp-transport');
exports.sendEmail = async (email, otp) => {
  // return console.log("email", message);
  try {
    const transporter = nodemailer.createTransport({
      // service: 'process.env.SERVICE',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        pass: process.env.APP_PASSWORD,
        user: process.env.SENDER_MAIL,
      },
    });

    const sendCompanyMail = await transporter.sendMail({
      from: "TEST@EV-CHARGING",
      to: email,
      subject: "Email Verification",
      html: ` 
          <p>Your Otp for email verification is </p>
          <p>${otp}</p>
          `,
      headers: {
        "x-priority": "1",
        "x-msmail-priority": "High",
        importance: "high",
      },
    });

    if (
      sendCompanyMail &&
      sendCompanyMail.response &&
      sendCompanyMail.response.startsWith("250")
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error, "email not sent");
  }
};
