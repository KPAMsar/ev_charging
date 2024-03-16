const mongoose = require("mongoose");

const ConnectionTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  { timestamps: true }
);

const VehicleType = mongoose.model("ConnectionType", ConnectionTypeSchema);

module.exports = VehicleType;
