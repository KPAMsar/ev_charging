const mongoose = require("mongoose");

const BookingSlotSchema = new mongoose.Schema(
  {
    bookingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleType",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookingSlot", BookingSlotSchema);
