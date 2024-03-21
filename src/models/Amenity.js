const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Amenity = mongoose.model("Amenity", amenitySchema);

module.exports = Amenity;
