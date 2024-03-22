const mongoose = require("mongoose");

const vehicleModelSchema = new mongoose.Schema(
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

const VehicleType = mongoose.model("VehicleModel", vehicleModelSchema);

module.exports = VehicleType;
