const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const VerifyEmail = require("../utils/sendEmail");
const OTP = require("../../src/models/OTP");
const otpGenerator = require("otp-generator");

exports.adminSignUp = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;

    if (!first_name || !last_name || !email || !phone_number || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email }).exec();
    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: "Email is already taken by another user.",
      });
      return;
    }

    // Check if phone number is already registered
    const existingPhoneNumber = await User.findOne({ phone_number }).exec();
    if (existingPhoneNumber) {
      res.status(409).json({
        success: false,
        message: "Phone number is already taken by another user.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email: email.toLowerCase().trim(),
      phone_number,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const tokenPair = generateTokens(savedUser);

    //SEND OTP
    const code = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpirationTime = new Date();
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 15);

    const otp = new OTP({
      email: savedUser.email,
      code,
      type: "emailVerification",
      expiresIn: otpExpirationTime,
    });

    await otp.save();

    // Send email with OTP
    const sentMail = await sendEmail(savedUser.email, code);

    console.log("Mail sent:", sentMail);

    return res.status(200).json({
      success: true,
      message: "Email verification code sent successfully.",
      data: {
        email: savedUser.email,
        phone_number: savedUser.phone_number,
        ...tokenPair,
      },
    });
  } catch (error) {
    console.error("SignUp error:", error);

    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(409).json({
        success: false,
        message: "Email or phone number is already taken.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.adminVerifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    // Find the user based on the provided email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for the provided email",
      });
    }

    // Find the corresponding OTP record for the user and the provided code
    const otpRecord = await OTP.findOne({
      email: email,
      code,
      type: "emailVerification",
      isValid: true,
    });

    if (!otpRecord || otpRecord.expiresIn < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    otpRecord.isValid = false;
    await otpRecord.save();

    user.isEmailVerified = true;
    user.role = "admin";
    await user.save();

    // Delete the used OTP record
    await otpRecord.deleteOne();
    sendSuccessRegEmail();
    return res.status(200).json({
      success: true,
      message: "Email verified successful",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.disableAdmin = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.isDisabled = true;
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    return res.json({ success: true, admins });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
