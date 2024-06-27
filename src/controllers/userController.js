const User = require("../models/user");

const disableUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "No ID found",
        success: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isDisabled: true },
      { new: true }
    );

    // Check if user exists
    if (!updatedUser) {
      return res.status(400).json({
        message: "User not found in the database",
        success: false,
      });
    }

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

const activateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "No ID found",
        success: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isDisabled: false },
      { new: true }
    );

    // Check if user exists
    if (!updatedUser) {
      return res.status(400).json({
        message: "User not found in the database",
        success: false,
      });
    }

    // User successfully updated
    return res.status(200).json({
      success: true,
      message: "User activated successfully",
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

const checkPhoneNumberStatus = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const existingUser = await User.findOne({
      phone_number: phoneNumber,
    });

    if (existingUser) {
      res.json({
        message: "Phone number is not available for use",
        exists: true,
      });
    } else {
      res.json({ message: "Phone number available for use", exists: false });
    }
  } catch (error) {
    console.error("Error checking phone number:", error);
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
};

const checkEmailStatus = async (req, res) => {
  try {
    const email = req.params.email;
    const existingUser = await User.findOne({
      email: email,
    });

    if (existingUser) {
      res.json({
        message: "Email is not available for use",
        exists: true,
      });
    } else {
      res.json({ message: "Email available for use", exists: false });
    }
  } catch (error) {
    console.error("Error checking Email:", error);
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "No ID found",
        success: false,
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    // Check if user exists
    if (!deletedUser) {
      return res.status(400).json({
        message: "User not found in the database",
        success: false,
      });
    }

    // User successfully deleted
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
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

module.exports = {
  deleteUser,
  disableUser,
  checkPhoneNumberStatus,
  checkEmailStatus,
  getAllUsers,
  activateUser,
};
