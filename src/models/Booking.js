const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  booking_id: String,
  charging_point: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChargingPoint",
    required: true,
  },
  vehicle_model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VehicleModel",
    required: true,
  },
  vehicle_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VehicleType",
    required: true,
  },
  connection_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ConnectionType",
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Price",
    required: true,
  },
  payment_status: {
    type: String,

    enum: ["pending", "declined", "successful"],
    default: "pending",
  },
  charge_status: {
    type: String,

    enum: ["pending", "charging", "charged"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // user_rating: {
  //   type: Number,
  //   required: true,
  // },
});

const Bookings = mongoose.model("Booking", bookingSchema);

module.exports = Bookings;
