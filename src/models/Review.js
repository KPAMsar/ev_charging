const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    chargingPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChargingPoint",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
