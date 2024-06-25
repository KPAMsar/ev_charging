const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    baseValue: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // duration in hours
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      default: 10, // default rate increase per hour
    },
  },
  { timestamps: true }
);

PriceSchema.methods.calculatePrice = function (duration) {
  return this.baseValue + this.rate * duration;
};

module.exports = mongoose.model("Price", PriceSchema);
