const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
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
    isValid: {
      type: Boolean,
      default: true,
    },
    expiresIn: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Define pre-save hook to check and update token validity
otpSchema.pre("save", function (next) {
  if (this.expiresIn && this.expiresIn <= new Date()) {
    this.isValid = false;
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
