const express = require("express");
const router = express.Router();
const connectionTypeController = require("../controllers/connectionTypeController");
const Authenticated = require("../middleware/authenticate");

// Create a new connection type
router.post("/", Authenticated, connectionTypeController.createConnectionType);

// Get all connection types
router.get("/", Authenticated, connectionTypeController.getAllConnectionTypes);

// Get a connection type by ID
router.get(
  "/:id",
  Authenticated,
  connectionTypeController.getConnectionTypeById
);

router.post(
  "/update-status",
  Authenticated,
  connectionTypeController.updateConnectionTypeStatus
);
// Update a connection type by ID
router.put(
  "/:id",
  Authenticated,
  connectionTypeController.updateConnectionTypeById
);

// Delete a connection type by ID
router.delete("/:id", connectionTypeController.deleteConnectionTypeById);

module.exports = router;
