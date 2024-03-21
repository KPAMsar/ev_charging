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
