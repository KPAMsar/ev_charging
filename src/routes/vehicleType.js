const express = require("express");
const router = express.Router();
const {
  createVehicleType,
  getAllVehicleTypes,
  getVehicleTypeById,
  updateVehicleType,
  deleteVehicleType,
} = require("../controllers/vehicleTypeController");

// Route to create a new vehicle type
router.post("/", createVehicleType);

// Route to get all vehicle types
router.get("/", getAllVehicleTypes);

// Route to get a vehicle type by ID
router.get("/:id", getVehicleTypeById);

// Route to update a vehicle type
router.put("/:id", updateVehicleType);

// Route to delete a vehicle type
router.delete("/:id", deleteVehicleType);

module.exports = router;
