// const image = require('./legumes.jpg')
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// const smtpTransport = require('nodemailer-smtp-transport');
exports.sendEmail = async (email, otp) => {
  try {
    // Create transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_TRAP_USERNAME,
        pass: process.env.MAIL_TRAP_PWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Define email options
    const mailOptions = {
      from: '"Connect Volt" <noreply@connectvolt.com>',
      to: email,
      subject: "Connect Volt Charging Email Verification",
      html: `
      <img src='' >
        <p>Dear User,<br>
        Thank you for registering with us. Your One Time Password (OTP) for email verification is:<br>
        <b>${otp}</b><br>
        Please use this OTP to complete the verification process. If you have any questions or concerns, feel free to reach out to our support team.<br>
        Best regards,<br>
        EV Charging Team</p>
      `,
      headers: {
        "x-priority": "1",
        "x-msmail-priority": "High",
        importance: "high",
      },
    };

    // Send email
    const sendCompanyMail = await transporter.sendMail(mailOptions);

    if (sendCompanyMail && sendCompanyMail.accepted.length > 0) {
      return true;
    } else {
      console.log("Email not sent:", sendCompanyMail);
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

exports.sendSuccessRegEmail = async () => {
  // return console.log("email", message);
  try {
    // const transporter = nodemailer.createTransport({
    //   // service: 'process.env.SERVICE',
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     pass: process.env.APP_PASSWORD,
    //     user: process.env.SENDER_MAIL,
    //   },
    // });

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 586,
      auth: {
        user: process.env.MAIL_TRAP_USERNAME,
        pass: process.env.MAIL_TRAP_PWORD,
      },
    });

    const sendCompanyMail = await transporter.sendMail({
      from: "TEST@EV-CHARGING",
      to: email,
      subject: "EV Charging Email Verification",
      html: ` 
          <p>Dear User,
<br>


        Congratulations! Welcome to our community at EV Charging. We are thrilled to have you onboard.
        <br>
        Thank you for registering with us. Your account has been successfully created and verified.
        <br>
        As part of the registration process, a One Time Password (OTP) was sent to your email for verification. We are pleased to confirm that your account has been successfully verified.
        <br>
        Please note that your account is now active and ready to use. If you have any questions or need assistance, please don't hesitate to reach out to our support team. We are here to assist you every step of the way.

                
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

exports.sendResetEmail = async (email, otp) => {
  // return console.log("email", message);
  try {
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 586,
      auth: {
        user: process.env.MAIL_TRAP_USERNAME,
        pass: process.env.MAIL_TRAP_PWORD,
      },
    });

    const sendCompanyMail = await transporter.sendMail({
      from: "TEST@EV-CHARGING",
      to: email,
      subject: "EV Charging Password Reset",
      html: ` 
          <p>Dear User,
<br>
We have received a request to reset your password. Your One Time Password (OTP) for password reset is:
          <br>
          <b>${otp}</b>
          <br>
          
Please use this OTP to proceed with resetting your password. If you did not request this password reset or have any concerns, please contact our support team immediately.
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

exports.sendSuccessResetEmail = async (email) => {
  // return console.log("email", message);
  try {
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 586,
      auth: {
        user: process.env.MAIL_TRAP_USERNAME,
        pass: process.env.MAIL_TRAP_PWORD,
      },
    });

    const sendCompanyMail = await transporter.sendMail({
      from: "TEST@EV-CHARGING",
      to: email,
      subject: "EV Charging Password Reset",
      html: ` 
          <p>Dear User,
<br>

      We wanted to inform you that your password has been successfully changed.
      <br>
      If you initiated this password change, no further action is required from you.
      <br>
      However, if you did not initiate this change, we strongly advise you to contact our support team immediately to ensure the security of your account.
      <br>
      Please remember to keep your password safe and secure. If you have any questions or need assistance, please don't hesitate to reach out to our support team. We are here to assist you every step of the way.

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
