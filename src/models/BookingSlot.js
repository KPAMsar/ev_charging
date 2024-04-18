const mongoose = require("mongoose");

const BookingSlotSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleType",
      required: true,
    },
    vehicleModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleModel",
      required: true,
    },
    connectionType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConnectionType",
      required: true,
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },

    price: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Price",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookingSlot", BookingSlotSchema);
