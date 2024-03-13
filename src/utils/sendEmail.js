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
      subject: "EV Charging Email Verification",
      html: ` 
          <p>Dear User,
<br>
          Thank you for registering with us. Your One Time Password (OTP) for email verification is:
          <br>
          <b>${otp}</b>
          <br>
          Please use this OTP to complete the verification process. If you have any questions or concerns, feel free to reach out to our support team.
          <br>
          Best regards,<br>
          EV Charging Team </p>
         
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
