const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const VerifyEmail = require("../utils/sendEmail");
const OTP = require("../../src/models/OTP");
const otpGenerator = require("otp-generator");
const {
  sendEmail,
  sendSuccessRegEmail,
  sendSuccessResetEmail,
  sendResetEmail,
} = require("../utils/sendEmail");
require("dotenv").config();

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { name: user.email, role: user.role, userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
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

  if (!foundUser) return res.status(401).send("Unauthorized user"); //Unauthorized

  const match = await foundUser.comparePassword(password);

  if (match) {
    if (
      foundUser.isEmailVerified !== "true" &&
      foundUser.isEmailVerified !== true
    ) {
      return res.json({
        message: "User is not verified",
      });
    }

    const role = foundUser.role;

    // Generate access token
    const accessToken = jwt.sign(
      {
        name: foundUser.email,
        role: foundUser.role,
        foundUserId: foundUser._id,
      },

      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        name: foundUser.email,
        role: foundUser.role,
        foundUserId: foundUser._id,
      },
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

    res.json({ role, refreshToken, isAdmin: match.isAdmin });
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

// USED TO SEND PASSWORD RESET OTP AFTER WHICH OTP WILL BE VERIFIED BY ANOTHER ENDPOINT
const SendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found for the provided email",
    });
  }

  const code = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otpExpirationTime = new Date();
  otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 15);

  const otp = new OTP({
    email: email,
    code,
    type: "passwordReset",
    expiresIn: otpExpirationTime,
  });

  await otp.save();

  // Send email with OTP
  const sentMail = await sendResetEmail(email, code);

  console.log("Reset pASSWPRDMail sent:", sentMail);
  if (sentMail !== true) {
    return res.json({
      success: true,
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Password reset code sent successfully.",
  });
};

const verifyResetPasswordOTP = async (req, res) => {
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
      type: "passwordReset",
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
    await user.save();

    // Delete the used OTP record
    // await otpRecord.deleteOne();

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

const ChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.foundUserId;
    // Find the user by userId
    const user = await User.findById(userId);

    // If user not found, return error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const ResetMyPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword, resetToken } = req.body;

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // Find the user by email and resetToken
    const user = await User.findOne({ email });

    const foundUserOTP = await OTP.findOne({
      email,
      code: resetToken,
      type: "passwordReset",
      isValid: true,
    });

    // If user not found or reset token is expired, return error
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and resetToken
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
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

const getLoggedInUser = async (req, res) => {
  try {
    // const loggedInUser = req.user;
    // if (!loggedInUser) {
    //   return res.send("User not logged in");
    // }
    console.log("logged in user");
    return res.json({ success: true, user: loggedInUser });
  } catch (error) {
    console.error("Error retrieving logged-in user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  SignUp,
  Login,
  CheckPhoneAndMailAvailability,
  verifyEmail,
  SendResetPasswordEmail,
  verifyResetPasswordOTP,
  ChangePassword,
  ResetMyPassword,
  getLoggedInUser,
};
