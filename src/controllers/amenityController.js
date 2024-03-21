const Amenity = require("../models/Amenity");

// Create a new amenity
exports.createAmenity = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const newAmenity = new Amenity({ name });
    await newAmenity.save();

    return res.status(201).json({ success: true, amenity: newAmenity });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get all amenities
exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find();
    return res.status(200).json({ success: true, amenities });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get an amenity by ID
exports.getAmenityById = async (req, res) => {
  try {
    const { id } = req.params;
    const amenity = await Amenity.findById(id);

    if (!amenity) {
      return res
        .status(404)
        .json({ success: false, message: "Amenity not found" });
    }

    return res.status(200).json({ success: true, amenity });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Update an amenity by ID
exports.updateAmenityById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const amenity = await Amenity.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!amenity) {
      return res
        .status(404)
        .json({ success: false, message: "Amenity not found" });
    }

    return res.status(200).json({ success: true, amenity });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete an amenity by ID
exports.deleteAmenityById = async (req, res) => {
  try {
    const { id } = req.params;
    const amenity = await Amenity.findByIdAndDelete(id);

    if (!amenity) {
      return res
        .status(404)
        .json({ success: false, message: "Amenity not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Amenity deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
