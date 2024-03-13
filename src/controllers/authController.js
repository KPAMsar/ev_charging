const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const VerifyEmail = require("../utils/sendEmail");
const OTP = require("../../src/models/OTP");
const otpGenerator = require("otp-generator");
const { sendEmail } = require("../utils/sendEmail");
require("dotenv").config();

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { name: user.name, role: user.role, userId: user.id },
    "AzTQ,RP)0(",
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  return { accessToken, refreshToken };
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  const match = await foundUser.comparePassword(password);
  if (match) {
    const role = foundUser.role;

    // Generate access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          role: role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Save refresh token with current user
    foundUser.refreshToken.push(refreshToken);
    await foundUser.save();

    // Set access token as a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 1000, // 10 seconds for demonstration purposes, change as needed
    });

    // Send refresh token in response body (not recommended in production, just for demonstration)
    res.json({ role, refreshToken });
  } else {
    res.sendStatus(401);
  }
};

const SignUp = async (req, res) => {
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
      return res.status(409).json({
        success: false,
        message: "Email is already taken by another user.",
      });
    }

    // Check if phone number is already registered
    const existingPhoneNumber = await User.findOne({ phone_number }).exec();
    if (existingPhoneNumber) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already taken by another user.",
      });
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

    console.log("Generated token", code);
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

const verifyEmail = async (req, res) => {
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
    });

    if (!otpRecord || otpRecord.expiresIn < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    // Delete the used OTP record
    await otpRecord.deleteOne();

    res.status(200).json({
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

const CheckPhoneAndMailAvailability = async (req, res) => {
  try {
    const { email, phone_number } = req.body;

    // Check if email is available
    const emailExists = await User.exists({ email });
    // Check if phone number is available
    const phoneExists = await User.exists({ phone_number });

    if (email && !phone_number) {
      return res.status(200).json({
        success: true,
        messages: "Email is not available for use",
        exists: emailExists,
      });
    } else if (!email && phone_number) {
      return res.status(200).json({
        success: true,
        messages: "Phone number is not available for use ",
        exists: phoneExists,
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Please provide either email or phone_number in the request body.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
    // console.log("ee", req.user);
    const email = req.body.email;
    if (!email) {
      return res.json({
        success: false,
        message: "Email field is required",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    const code = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpirationTime = new Date();
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 15);

    const otp = new OTP({
      user: user.id,
      code,
      type: "emailVerification",
      expiresIn: otpExpirationTime,
    });

    const saveOtp = await otp.save();
    VerifyEmail();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email verfication code sent successfully",
      data: saveOtp,
    });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  SignUp,
  Login,
  CheckPhoneAndMailAvailability,
  verifyEmail,
};
