const BookingSlot = require("../models/Booking");
const Notification = require("../models/Notification");

exports.createBooking = async (req, res, io) => {
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
      // user_rating,
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
      // "user_rating",
    ];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // Create a new booking slot
    const newBooking = new BookingSlot({
      charging_point,
      vehicle_model,
      connection_type,
      vehicle_type,
      date,
      time,
      price,
      user,
      // user_rating,
    });

    // Save the new booking slot to the database
    await newBooking.save();

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
    const bookings = await BookingSlot.find()
      .populate("vehicleType")
      .populate("vehicleModel")
      .populate("connectionType")
      .populate("price");

    return res.json(bookings);
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
    const booking = await BookingSlot.findById(id);
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
    const updatedBooking = await BookingSlot.findByIdAndUpdate(
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
    const deletedBooking = await BookingSlot.findByIdAndDelete(id);
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
