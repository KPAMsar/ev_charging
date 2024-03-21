const express = require("express");
const router = express.Router();
const connectionTypeController = require("../controllers/connectionTypeController");
const Authenticated = require("../middleware/authenticate");

// Create a new connection type
router.post("/", connectionTypeController.createConnectionType);

// Get all connection types
router.get("/", connectionTypeController.getAllConnectionTypes);

// Get a connection type by ID
router.get("/:id", connectionTypeController.getConnectionTypeById);

// Update a connection type by ID
router.put("/:id", connectionTypeController.updateConnectionTypeById);

// Delete a connection type by ID
router.delete("/:id", connectionTypeController.deleteConnectionTypeById);

module.exports = router;
