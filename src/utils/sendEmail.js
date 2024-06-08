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
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        pass: process.env.APP_PASSWORD,
        user: process.env.SENDER_MAIL,
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
      
      <!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Email Verification - Connect Volt</title>
    <meta name="description" content="Connect Volt Email Verification" />
    <style type="text/css">
      a:hover {
        text-decoration: underline !important;
      }
    </style>
  </head>

  <body style="margin: 0px; background-color: #f2f3f8">
    <!-- 100% body table -->
    <table
      cellspacing="0"
      border="0"
      cellpadding="0"
      width="100%"
      bgcolor="#f2f3f8"
      style="font-family: 'Open Sans', sans-serif; font-size: 16px; color: #333"
    >
      <tr>
        <td>
          <table
            style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
            width="100%"
            border="0"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <tr>
              <td style="height: 80px">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center">
                <a
                  href="https://connectvolt.com"
                  title="Connect Volt"
                  target="_blank"
                >
                  <img
                    src="/images/image.png"
                    title="Connect Volt"
                    alt="Connect Volt"
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td style="height: 20px">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <table
                  width="95%"
                  border="0"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width: 670px;
                    background: #fff;
                    border-radius: 3px;
                    text-align: center;
                    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                  "
                >
                  <tr>
                    <td style="height: 40px">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 35px">
                      <h1
                        style="
                          color: #1e1e2d;
                          font-weight: 500;
                          margin: 0;
                          font-size: 32px;
                          font-family: 'Rubik', sans-serif;
                        "
                      >
                        Email Verification
                      </h1>
                      <p
                        style="
                          font-size: 15px;
                          color: #455056;
                          margin: 8px 0 0;
                          line-height: 24px;
                        "
                      >
                        Dear User,<br />
                        Thank you for registering with Connect Volt. Your One
                        Time Password (OTP) for email verification is:
                      </p>
                      <h2
                        style="color: #20e277; font-size: 24px; margin: 20px 0"
                      >
                        ${otp}
                      </h2>
                      <p
                        style="
                          font-size: 15px;
                          color: #455056;
                          line-height: 24px;
                        "
                      >
                        Please enter this OTP on the verification page to
                        activate your account. The OTP is valid for a limited
                        time, so be sure to complete the verification process
                        promptly.
                        <br />
                        If you encounter any issues or have any questions, our
                        support team is here to assist you. You can reach us at
                        support@connectvolt.com.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 40px">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="height: 20px">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center">
                <p
                  style="
                    font-size: 14px;
                    color: rgba(69, 80, 86, 0.741);
                    line-height: 18px;
                    margin: 0;
                  "
                >
                  &copy; ${new Date().getFullYear()}
                  <strong>Connect Volt</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="height: 80px">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--/100% body table-->
  </body>
</html>
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
