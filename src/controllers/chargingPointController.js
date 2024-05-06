const ChargingPoint = require("../models/ChargingPoint");
const Cloudinary = require("../utils/cloudinary");
const User = require("../models/user");

// Create a new charging point
exports.createChargingPoint = async (req, res) => {
  try {
    const {
      name,
      location,
      connectionType,
      amenities,
      longitude,
      latitude,
      admin_user,
    } = req.body;

    if (
      !name ||
      !location ||
      !connectionType ||
      !longitude ||
      !latitude ||
      !admin_user
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, location,admin User, connection type, longitude, and latitude are required",
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
      longitude,
      latitude,
      connectionType,
      amenities,
      picture: {
        public_id: pictureUrl ? pictureUrl.public_id : null,
        url: pictureUrl ? pictureUrl.secure_url : null,
      },
    });

    newChargingPoint.adminUser = [
      ...(newChargingPoint.adminUser || []),
      admin_user,
    ];

    const savedData = await newChargingPoint.save();

    return res.status(201).json({ success: true, chargingPoint: savedData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.findChargingPointByAttendant = async (req, res) => {
  try {
    const loggedInUserId = req.user.foundUserId;
    const chargingPoint = await ChargingPoint.findOne({
      attendants: loggedInUserId,
    });

    if (chargingPoint) {
      return res.status(200).json({
        success: true,
        message: `Charging point found for attendant ${loggedInUserId}`,
        data: chargingPoint,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `No charging point found for attendant ${loggedInUserId}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for charging point",
      error: error.message,
    });
  }
};

exports.addAttendantToChargingPoint = async (req, res) => {
  try {
    // Validate user data
    const userData = req.body;
    await validateUserData(userData);

    // Create new user
    const newUser = await createUser(userData);

    // Add user as attendant to charging point
    const { chargingPointId, attendantId } = userData;
    await addAttendantToChargingPoint(chargingPointId, attendantId);

    res.status(200).json({
      success: true,
      message: "Attendant added to charging point successfully",
      chargingPointId: chargingPointId,
    });
  } catch (error) {
    console.error("Add Attendant error:", error);

    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(409).json({
        success: false,
        message: "Email or phone number is already taken.",
      });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Validate user data
const validateUserData = async (userData) => {
  const { first_name, last_name, email, phone_number } = userData;
  if (!first_name || !last_name || !email || !phone_number) {
    throw { status: 400, message: "All fields are required." };
  }

  // Check if email is already registered
  const existingEmail = await User.findOne({ email }).exec();
  if (existingEmail) {
    throw { status: 409, message: "Email is already taken by another user." };
  }

  // Check if phone number is already registered
  const existingPhoneNumber = await User.findOne({ phone_number }).exec();
  if (existingPhoneNumber) {
    throw {
      status: 409,
      message: "Phone number is already taken by another user.",
    };
  }
};

// Create new user
const createUser = async (userData) => {
  const { first_name, last_name, email, phone_number, role } = userData;
  const hashedPassword = await bcrypt.hash("4444", 10);

  const newUser = new User({
    firstname: first_name,
    lastname: last_name,
    email: email.toLowerCase().trim(),
    phone_number,
    password: hashedPassword,
    role,
  });

  return newUser.save();
};

// Add user as attendant to charging point
const addAttendantToChargingPoint = async (chargingPointId, attendantId) => {
  // Find the charging point by ID
  const chargingPoint = await ChargingPoint.findById(chargingPointId);
  if (!chargingPoint) {
    throw { status: 404, message: "Charging point not found" };
  }

  // Check if the attendant is already assigned to the charging point
  if (chargingPoint.attendants.includes(attendantId)) {
    throw {
      status: 400,
      message: "Attendant is already assigned to this charging point",
    };
  }

  // Add the attendant to the charging point's attendants array
  chargingPoint.attendants.push(attendantId);
  await chargingPoint.save();
};

exports.addConnectionTypesToChargingPoint = async (req, res) => {
  try {
    const chargingPointId = req.body.id;
    const connectionTypeData = req.body.connectionType;

    if (!chargingPointId) {
      return res.status(400).json({
        success: false,
        message: "Charging point ID is required",
      });
    }

    const foundData = await ChargingPoint.findById(chargingPointId);

    if (!foundData) {
      return res.status(404).json({
        success: false,
        message: "Charging point not found",
      });
    }

    if (!connectionTypeData) {
      return res.status(400).json({
        success: false,
        message: "Connection type data is required",
      });
    }

    // Deduplicate connection types and add new ones
    const uniqueConnectionTypes = [
      ...new Set([...foundData.connectionType, ...connectionTypeData]),
    ];
    foundData.connectionType = uniqueConnectionTypes;

    await foundData.save();

    return res.status(200).json({
      success: true,
      message: "Connection Types updated successfully",
      data: foundData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.getAllConnectionTypesFromChargingPoint = async (req, res) => {
  try {
    const chargingPointId = req.params.id; // Assuming you're passing the charging point ID through params

    const chargingPoint = await ChargingPoint.findById(
      chargingPointId
    ).populate("connectionType");

    if (!chargingPoint) {
      return res.status(404).json({
        success: false,
        message: "Charging point not found",
      });
    }

    const connectionTypes = chargingPoint.connectionType;

    return res.status(200).json({
      success: true,
      message: "Connection types fetched successfully",
      data: connectionTypes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching connection types",
      error: error.message,
    });
  }
};

// Get all charging points
exports.getAllChargingPoints = async (req, res) => {
  try {
    const chargingPoints = await ChargingPoint.find().populate(
      "amenities connectionType reviews"
    );
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

    // Check if the ID parameter is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Charging point ID is required" });
    }

    // Find the charging point by ID and populate its related fields
    const chargingPoint = await ChargingPoint.findOne({ _id: id })
      .populate("amenities")
      .populate("connectionType")
      .populate({
        path: "reviews",
        match: { chargingPoint: id },
      });
    // Check if the charging point exists
    if (!chargingPoint) {
      return res
        .status(404)
        .json({ success: false, message: "Charging point not found" });
    }

    // Return the charging point details
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
    const { name, location, connectionType, amenities } = req.body;
    let pictureUrl = null;

    if (req.file) {
      // Upload image to Cloudinary
      const result = await Cloudinary.uploader.upload(req.file.path, {
        folder: "ChargingPoint",
      });

      pictureUrl = result;
    }

    const chargingPoint = await ChargingPoint.findByIdAndUpdate(
      id,
      {
        name,
        location,
        connectionType,
        amenities,
        picture: {
          public_id: pictureUrl.public_id,
          url: pictureUrl.secure_url,
        },
      },
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

//     const nearChargingPoints = allChargingPoints.filter((chargingPoint) => {
//       const distance = calculateDistance(
//         latitude,
//         longitude,
//         chargingPoint.latitude,
//         chargingPoint.longitude
//       );
//       return distance <= radius;
//     });

//     res.json({ success: true, data: nearChargingPoints });
//   } catch (error) {
//     console.error("Error fetching or filtering charging points:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching or filtering charging points",
//     });
//   }
// };

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

exports.getNearByChargingPoints = async (req, res) => {
  let { latitude, longitude, radius } = req.query;

  // If radius is not provided, set a default value of 10
  if (!radius) {
    radius = 10;
  }

  try {
    const allChargingPoints = await ChargingPoint.find().populate("amenities"); // Populate the amenities field

    let nearChargingPoints;
    if (latitude && longitude) {
      nearChargingPoints = allChargingPoints.filter((chargingPoint) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          chargingPoint.latitude,
          chargingPoint.longitude
        );
        return distance <= radius;
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required parameters.",
      });
    }

    res.json({
      success: true,
      message: "List of charging points",
      data: nearChargingPoints,
    });
  } catch (error) {
    console.error("Error fetching or filtering charging points:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching or filtering charging points",
    });
  }
};

exports.approveChargingPoint = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
      });
    }

    const updatedChargingPoint = await ChargingPoint.findOneAndUpdate(
      { _id: id },
      { $set: { status: "approved" } },
      { new: true }
    );

    if (!updatedChargingPoint) {
      return res.json({
        success: false,
        message: "Charging point not found",
      });
    }

    return res.json({
      success: true,
      message: "Charging point approved successfully",
      data: updatedChargingPoint,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
