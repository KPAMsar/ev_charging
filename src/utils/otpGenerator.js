const otpGenerator = require("otp-generator");
const OTP = require("../../src/models/OTP");

const generateOTP = async (email) => {
  const code = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const expiresIn = new Date();
  expiresIn.setMinutes(expiresIn.getMinutes() + 15);

  const otp = new OTP({
    email: email,
    code,
    type: "emailVerification",
    expiresIn: expiresIn,
  });

  await otp.save();
  return code;
};

module.exports = { generateOTP };
