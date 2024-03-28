const BookingSlot = require("../models/BookingSlot");

exports.createBooking = async (req, res) => {
  try {
    const requiredFields = [
      "vehicleType",
      "vehicleModel",
      "connectionType",
      "schedule",
      "date",
      "time",
      "price",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const newBooking = new BookingSlot({
      vehicleType,
      vehicleModel,
      connectionType,
      schedule,
      date,
      time,
      price,
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
