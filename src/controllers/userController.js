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

module.exports = {
  disableUser,
};
