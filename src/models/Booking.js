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
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
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
