const mongoose = require("mongoose");

const chargingPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  amenities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
    },
  ],
  connectionType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ConnectionType",
    required: true,
  },
  status: {
    type: String,
    enum: ["Charging", "Available", "Out of service"],
    default: "Available",
  },
  approved: {
    type: Boolean,
    default: false,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  picture: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});

const ChargingPoint = mongoose.model("ChargingPoint", chargingPointSchema);

module.exports = ChargingPoint;
