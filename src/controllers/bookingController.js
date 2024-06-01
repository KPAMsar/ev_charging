const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const ChargingPoint = require("../models/ChargingPoint");
// const { customAlphabet } = require("nanoid");

exports.createBooking = async (req, res) => {
  try {
    const {
      charging_point,
      vehicle_model,
      connection_type,
      date,
      time,
      price,
      payment_status,
      charge_status,
      vehicle_type,
    } = req.body;

    const user = req.user.foundUserId;

    // Check if all required fields are provided
    const requiredFields = [
      "charging_point",
      "vehicle_model",
      "connection_type",
      "date",
      "time",
      "price",
      "vehicle_type",
    ];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }
    const { customAlphabet } = await import("nanoid");

    // Create a custom nanoid function
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const bookingId = `ConnectVolt-${nanoid()}`;

    // Create a new booking slot
    const newBooking = new Booking({
      charging_point,
      vehicle_model,
      connection_type,
      vehicle_type,
      date,
      time,
      price,
      user,
      booking_id: bookingId,
    });

    // Save the new booking slot to the database
    await newBooking.save();

    const newNotification = new Notification({
      recipient: user,
      chargingPoint: charging_point,
      type: "info",
      title: "New Booking Created",
      message: `Your booking (ID: ${newBooking.booking_id}) has been created successfully.`,
      status: "unread",
      url: `/bookings/${newBooking._id}`,
    });

    await newNotification.save();
    // Emit the new booking event using the io object
    const saveNotification = new Notification({
      message: "New Booking ",
      user: req.user.foundUserId,
      booking: newBooking._id,
    });

    await saveNotification.save();
    // Send a successful response with the created booking slot
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // const bookings = await Booking.find().populate(
    //   "connection_type vehicle_model user vehicle_type price charging_point"
    // );

    const bookings = await Booking.find().populate([
      { path: "connection_type", model: "ConnectionType" },
      { path: "vehicle_model", model: "VehicleModel" },
      { path: "user", model: "User" },
      { path: "vehicle_type", model: "VehicleType" },
      { path: "price", model: "Price" },
      { path: "charging_point", model: "ChargingPoint" },
    ]);

    return res.json(bookings);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAllBookingsByChargingPoint = async (req, res) => {
  try {
    const chargingPointId = req?.user?.chargingPoint;
    console.log("chargingPointId", chargingPointId);
    if (!chargingPointId) {
      return res.status(400).json({
        success: false,
        message: "Charging point ID is required",
      });
    }

    const bookings = await Booking.find({
      charging_point: chargingPointId,
    }).populate(
      "connection_type vehicle_model user vehicle_type price charging_point"
    );

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this charging point",
      });
    }

    return res.json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }
    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    return res.json(booking);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehicleType,
      vehicleModel,
      connectionType,
      schedule,
      date,
      time,
      price,
    } = req.body;
    if (
      !id ||
      !vehicleType ||
      !vehicleModel ||
      !connectionType ||
      !schedule ||
      !date ||
      !time ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        vehicleType,
        vehicleModel,
        connectionType,
        schedule,
        date,
        time,
        price,
      },
      { new: true }
    );
    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    return res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    return res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getTopChargingPoints = async (req, res) => {
  try {
    // Find all bookings with 'charged' status and populate the 'charging_point' field
    const bookings = await Booking.find({ charge_status: "charged" }).populate(
      "charging_point"
    );

    if (!bookings.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No bookings with 'charged' status found",
      });
    }

    const chargingPointPerformance = {};

    bookings.forEach((booking) => {
      const chargingPoint = booking.charging_point;
      if (chargingPoint) {
        const chargingPointId = chargingPoint._id.toString();
        if (!chargingPointPerformance[chargingPointId]) {
          chargingPointPerformance[chargingPointId] = 0;
        }
        chargingPointPerformance[chargingPointId]++;
      }
    });

    const sortedChargingPoints = Object.entries(chargingPointPerformance)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (!sortedChargingPoints.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No charging points with 'charged' bookings found",
      });
    }

    const topChargingPoints = await Promise.all(
      sortedChargingPoints.map(async ([chargingPointId]) => {
        const chargingPoint = await ChargingPoint.findById(chargingPointId);
        return {
          chargingPoint,
          completedBookings: chargingPointPerformance[chargingPointId],
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: topChargingPoints,
    });
  } catch (error) {
    console.error("Error fetching top charging points:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
