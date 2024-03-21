const ChargingPoint = require("../models/ChargingPoint");
const Cloudinary = require("../utils/cloudinary");

// Create a new charging point
exports.createChargingPoint = async (req, res) => {
  try {
    const { name, location, connectionType } = req.body;

    if (!name || !location || !connectionType) {
      return res.status(400).json({
        success: false,
        message: "Name, location, and connection type are required",
      });
    }
    let pictureUrl = null;

    if (req.file) {
      // Upload image to Cloudinary
      const result = await Cloudinary.uploader.upload(req.file.path, {
        folder: "ChargingPoint",
      });
      console.log("pic", result);
      pictureUrl = result;
    }

    const newChargingPoint = new ChargingPoint({
      name,
      location,
      connectionType,
      picture: {
        public_id: pictureUrl.public_id,
        url: pictureUrl.secure_url,
      },
    });
    const savedData = await newChargingPoint.save();

    return res
      .status(201)
      .json({ success: true, chargingPoint: newChargingPoint });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get all charging points
exports.getAllChargingPoints = async (req, res) => {
  try {
    const chargingPoints = await ChargingPoint.find();
    return res.status(200).json({ success: true, chargingPoints });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get a charging point by ID
exports.getChargingPointById = async (req, res) => {
  try {
    const { id } = req.params;
    const chargingPoint = await ChargingPoint.findById(id)
      .populate("amenities")
      .populate("connectionType");

    if (!chargingPoint) {
      return res
        .status(404)
        .json({ success: false, message: "Charging point not found" });
    }

    return res.status(200).json({ success: true, chargingPoint });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Update a charging point by ID
exports.updateChargingPoint = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, connectionType } = req.body;

    const chargingPoint = await ChargingPoint.findByIdAndUpdate(
      id,
      { name, location, connectionType },
      { new: true }
    );

    if (!chargingPoint) {
      return res
        .status(404)
        .json({ success: false, message: "Charging point not found" });
    }

    return res.status(200).json({ success: true, chargingPoint });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a charging point by ID
exports.deleteChargingPointById = async (req, res) => {
  try {
    const { id } = req.params;
    const chargingPoint = await ChargingPoint.findByIdAndDelete(id);

    if (!chargingPoint) {
      return res
        .status(404)
        .json({ success: false, message: "Charging point not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Charging point deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
