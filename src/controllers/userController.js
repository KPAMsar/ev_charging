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
    const foundUser = User.findById(id);
    if (!foundUser) {
      return res.status(400).json({
        message: "User not found in the database",
        success: false,
      });
    }
    foundUser.isDisabled = true;
    foundUser.save();
    return res.status(200).json({
      success: true,
      message: " User disabled successfully",
      data: foundUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An error occured",
      error: err.message,
    });
  }
};

module.exports = {
  disableUser,
};
