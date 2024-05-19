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

router.post(
  "/update-connection-type",
  Authenticated,
  ChargingPointController.addConnectionTypesToChargingPoint
);

router.get(
  "/chargingpoint/:id/connectiontypes",
  Authenticated,
  ChargingPointController.getAllConnectionTypesFromChargingPoint
);
router.get(
  "/charging-point-by-attendant",
  Authenticated,
  ChargingPointController.findChargingPointByAttendant
);
router.get(
  "/attendants-by-charging-point",
  Authenticated,
  ChargingPointController.getAttendantsByChargingPoint
);
router.post(
  "/add-attendants",
  Authenticated,
  ChargingPointController.addAttendantToChargingPoint
);

// Get all charging points
router.get("/", Authenticated, ChargingPointController.getAllChargingPoints);

router.get(
  "/connection-types",
  Authenticated,
  ChargingPointController.getConnectionTypesByChargingPoint
);

router.get(
  "/near-by",
  Authenticated,
  ChargingPointController.getNearByChargingPoints
);

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

router.patch(
  "/approve/:id",
  Authenticated,
  ChargingPointController.approveChargingPoint
);

// router.get('/search-stations', ChargingPointController.getNearByChargingPoints);

module.exports = router;
