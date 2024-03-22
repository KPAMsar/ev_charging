const VehicleModel = require("../models/VehicleModel");

// Create a new vehicle model
exports.createVehicleModel = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if required fields are available
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const existingVehicleModel = await VehicleModel.findOne({ name });

    // Check if vehicle model with the same name already exists
    if (existingVehicleModel) {
      return res.status(400).json({
        success: false,
        message: "Vehicle model with this name already exists",
      });
    }

    const newVehicleModel = new VehicleModel({ name, description });
    await newVehicleModel.save();

    return res.status(201).json({
      success: true,
      message: "Vehicle model created successfully",
      vehicleModel: newVehicleModel,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get all vehicle models
exports.getAllVehicleModels = async (req, res) => {
  try {
    const vehicleModels = await VehicleModel.find();
    return res.json(vehicleModels);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get a vehicle model by ID
exports.getVehicleModelById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const vehicleModel = await VehicleModel.findById(id);

    if (!vehicleModel) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle model not found" });
    }

    return res.json(vehicleModel);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Update a vehicle model
exports.updateVehicleModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if required fields are available
    if (!id || !name) {
      return res
        .status(400)
        .json({ success: false, message: "ID and Name are required" });
    }

    const existingVehicleModel = await VehicleModel.findById(id);

    if (!existingVehicleModel) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle model not found" });
    }

    // Check if there's another vehicle model with the same name
    if (name !== existingVehicleModel.name) {
      const otherVehicleModel = await VehicleModel.findOne({ name });

      if (otherVehicleModel) {
        return res.status(400).json({
          success: false,
          message: "Another vehicle model with this name already exists",
        });
      }
    }

    existingVehicleModel.name = name;
    existingVehicleModel.description = description;

    const updatedVehicleModel = await existingVehicleModel.save();
    return res.json({
      success: true,
      message: "Vehicle model updated successfully",
      vehicleModel: updatedVehicleModel,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a vehicle model
exports.deleteVehicleModel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    // Attempt to delete the vehicle model
    try {
      await VehicleModel.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: "Vehicle model deleted successfully",
      });
    } catch (error) {
      // If the ID is not found, return a success message
      if (error.name === "CastError" && error.kind === "ObjectId") {
        return res.json({
          success: true,
          message: "Vehicle model not found",
        });
      }
      // Otherwise, handle other errors
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
