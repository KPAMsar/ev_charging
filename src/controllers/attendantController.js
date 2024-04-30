const User = require("../models/user");
const bcrypt = require("bcrypt");

const fetchAttendantUsers = async (req, res) => {
  try {
    const attendantUsers = await User.find({ role: "attendant" });

    // Check if any users with role "attendant" were found
    if (attendantUsers.length === 0) {
      return res.status(404).json({
        message: "No attendant users found",
        success: false,
      });
    }

    // Return the attendant users
    return res.status(200).json({
      success: true,
      message: "Attendant users retrieved successfully",
      data: attendantUsers,
    });
  } catch (err) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
};

const disableAttendant = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "No ID found",
        success: false,
      });
    }

    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        message: "User not found in the database",
        success: false,
      });
    }

    // Check if the user's role is "attendant"
    if (user.role !== "attendant") {
      return res.status(403).json({
        message: "You are not authorized to disable this user",
        success: false,
      });
    }

    // Disable the user
    user.isDisabled = true;
    const updatedUser = await user.save();

    // User successfully updated
    return res.status(200).json({
      success: true,
      message: "User disabled successfully",
      data: updatedUser,
    });
  } catch (err) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
};

const addAttendant = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number } = req.body;

    if (!first_name || !last_name || !email || !phone_number) {
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

    const hashedPassword = await bcrypt.hash("4444", 10);

    const newUser = new User({
      first_name,
      last_name,
      email: email.toLowerCase().trim(),
      phone_number,
      password: hashedPassword,
      role: "attendant",
    });

    const savedUser = await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Attendant added successfully.",
      data: {
        email: savedUser.email,
        phone_number: savedUser.phone_number,
      },
    });
  } catch (error) {
    console.error("Add Attendant error:", error);

    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(409).json({
        success: false,
        message: "Email or phone number is already taken.",
      });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  disableAttendant,
  addAttendant,
  fetchAttendantUsers,
};
