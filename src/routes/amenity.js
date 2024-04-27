const express = require("express");
const router = express.Router();
const AmenityController = require("../controllers/amenityController");
const Authenticated = require("../middleware/authenticate");

// Create a new amenity
router.post("/", Authenticated, AmenityController.createAmenity);

// Get all amenities
router.get("/", AmenityController.getAllAmenities);

// Get an amenity by ID
router.get("/:id", AmenityController.getAmenityById);

// Update an amenity by ID
router.put("/:id", AmenityController.updateAmenityById);

// Delete an amenity by ID
router.delete("/:id", AmenityController.deleteAmenityById);

module.exports = router;
