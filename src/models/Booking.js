const mongoose = require("mongoose");

const BookingTypeSchema = new mongoose.Schema(
  {
    connection_type: {
      type: String,
      required: true,
    },
    vehicle_type: {
      type: String,
      required: true,
    },
    vehicle_model: {
      type: String,
      required: true,
    },
    description: String,
    location: String,
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingTypeSchema);

module.exports = Booking;
