const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  charging_point: {
    type: String,
    required: true,
  },
  vehicle_model: {
    type: String,
    required: true,
  },
  connection_type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    required: true,
  },
  charge_status: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  user_rating: {
    type: Number,
    required: true,
  },
});

const Bookings = mongoose.model("Booking", bookingSchema);

module.exports = Bookings;
