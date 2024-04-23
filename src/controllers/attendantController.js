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

module.exports = {
  disableAttendant,
  fetchAttendantUsers,
};
