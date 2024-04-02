const express = require("express");
const router = express.Router();
const ChargingPointController = require("../controllers/chargingPointController");
const Authenticated = require("../middleware/authenticate");
const upload = require("../utils/multer");

// Create a new charging point
router.post(
  "/",
  upload.single("file"),
  Authenticated,
  ChargingPointController.createChargingPoint
);

// Get all charging points
router.get("/", ChargingPointController.getAllChargingPoints);

// Get a charging point by ID
router.get("/:id", Authenticated, ChargingPointController.getChargingPointById);

// Update a charging point by ID
router.put(
  "/:id",
  upload.single("file"),
  Authenticated,
  ChargingPointController.updateChargingPoint
);

// Delete a charging point by ID
router.delete(
  "/:id",
  Authenticated,
  ChargingPointController.deleteChargingPointById
);

router.post(
  "/near-by",
  Authenticated,
  ChargingPointController.getNearByChargingPoints
);

module.exports = router;
