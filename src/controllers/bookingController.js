const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const {
      connection_type,
      vehicle_type,
      vehicle_model,
      description,
      location,
    } = req.body;
    if (!connection_type || !vehicle_type || !vehicle_model) {
      return res.status(400).json({
        success: false,
        message:
          "Connection type, vehicle type, and vehicle model are required",
      });
    }
    const newBooking = new Booking({
      connection_type,
      vehicle_type,
      vehicle_model,
      description,
      location,
    });
    await newBooking.save();
    return res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
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
      connection_type,
      vehicle_type,
      vehicle_model,
      description,
      location,
    } = req.body;
    if (!id || !connection_type || !vehicle_type || !vehicle_model) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "ID, connection type, vehicle type, and vehicle model are required",
        });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { connection_type, vehicle_type, vehicle_model, description, location },
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
