const express = require("express");
const router = express.Router();
const {
  createVehicleModel,
  getAllVehicleModels,
  getVehicleModelById,
  updateVehicleModel,
  deleteVehicleModel,
} = require("../controllers/vehicleModelController");

// Route to create a new vehicle model
router.post("/", createVehicleModel);

// Route to get all vehicle models
router.get("/", getAllVehicleModels);

// Route to get a vehicle model by ID
router.get("/:id", getVehicleModelById);

// Route to update a vehicle model
router.put("/:id", updateVehicleModel);

// Route to delete a vehicle model
router.delete("/:id", deleteVehicleModel);

module.exports = router;
