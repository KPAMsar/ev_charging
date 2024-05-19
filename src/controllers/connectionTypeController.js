const ConnectionType = require("../models/ConnectionType");

// Create a new connection type
exports.createConnectionType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const newConnectionType = new ConnectionType({ name, description });
    await newConnectionType.save();

    return res
      .status(201)
      .json({ success: true, connectionType: newConnectionType });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get all connection types
exports.getAllConnectionTypes = async (req, res) => {
  try {
    const connectionTypes = await ConnectionType.find();
    return res.status(200).json({ success: true, connectionTypes });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get a connection type by ID
exports.getConnectionTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const connectionType = await ConnectionType.findById(id);

    if (!connectionType) {
      return res
        .status(404)
        .json({ success: false, message: "Connection type not found" });
    }

    return res.status(200).json({ success: true, connectionType });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Update a connection type by ID
exports.updateConnectionTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const connectionType = await ConnectionType.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!connectionType) {
      return res
        .status(404)
        .json({ success: false, message: "Connection type not found" });
    }

    return res.status(200).json({ success: true, connectionType });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateConnectionTypeStatus = async (req, res) => {
  try {
    const { newStatus, connectionTypeId } = req.body;

    if (!connectionTypeId) {
      return res.status(400).json({
        success: false,
        message: "Connection type ID is required",
      });
    }

    if (
      !newStatus ||
      !["inUse", "available", "outOfService"].includes(newStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    const updatedConnectionType = await ConnectionType.findByIdAndUpdate(
      connectionTypeId,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    console.log("updatedConnectionType", updatedConnectionType);

    if (!updatedConnectionType) {
      return res.status(400).json({
        success: false,
        message: "Connection type not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Connection type status updated successfully",
      data: updatedConnectionType,
    });
  } catch (error) {
    console.error("Error updating connection type status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
// Delete a connection type by ID
exports.deleteConnectionTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const connectionType = await ConnectionType.findByIdAndDelete(id);

    if (!connectionType) {
      return res
        .status(404)
        .json({ success: false, message: "Connection type not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Connection type deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
