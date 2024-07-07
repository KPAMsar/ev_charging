const User = require("../models/user");

const getAllChargingPointAdmins = async (req, res) => {
  try {
    const chargingPointAdmins = await User.find({
      role: "charging-point-admin",
    }).select("-password");


    console.log('chargingPointAdmins',chargingPointAdmins)
    res.status(200).json({
      success: true,
      message: "Charging point admins retrieved successfully",
      data: chargingPointAdmins,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = { getAllChargingPointAdmins };
