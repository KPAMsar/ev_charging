const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chargingPoints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChargingPoint",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favourite", FavouriteSchema);
