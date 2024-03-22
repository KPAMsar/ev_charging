const VehicleType = require("../models/VehicleType");

// Create a new vehicle type
exports.createVehicleType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });
    }
    const existingVehicleType = await VehicleType.findOne({ name });

    // Check if vehicle type with the same name already exists
    if (existingVehicleType) {
      return res.status(400).json({
        success: false,
        message: "Vehicle type with this name already exists",
      });
    }

    const newVehicleType = new VehicleType({ name, description });
    await newVehicleType.save();

    return res.status(201).json({
      success: true,
      message: "Vehicle type created successfully",
      vehicleType: newVehicleType,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get all vehicle types
exports.getAllVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find();
    return res.json(vehicleTypes);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get a vehicle type by ID
exports.getVehicleTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const vehicleType = await VehicleType.findById(id);

    if (!vehicleType) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle type not found" });
    }

    return res.json(vehicleType);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Update a vehicle type
exports.updateVehicleType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if required fields are available
    if (!id || !name) {
      return res
        .status(400)
        .json({ success: false, message: "ID and Name are required" });
    }

    const existingVehicleType = await VehicleType.findById(id);

    if (!existingVehicleType) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle type not found" });
    }

    // Check if there's another vehicle type with the same name
    if (name !== existingVehicleType.name) {
      const otherVehicleType = await VehicleType.findOne({ name });

      if (otherVehicleType) {
        return res.status(400).json({
          success: false,
          message: "Another vehicle type with this name already exists",
        });
      }
    }

    existingVehicleType.name = name;
    existingVehicleType.description = description;

    const updatedVehicleType = await existingVehicleType.save();
    return res.json({
      success: true,
      message: "Vehicle type updated successfully",
      vehicleType: updatedVehicleType,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a vehicle type
exports.deleteVehicleType = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const vehicleType = await VehicleType.findById(id);

    if (!vehicleType) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle type not found" });
    }

    await VehicleType.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Vehicle type deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
