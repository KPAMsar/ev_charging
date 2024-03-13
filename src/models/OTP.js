const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
