const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Create a new notification
router.post("/", notificationController.createNotification);

// Get all notifications
router.get("/", notificationController.getAllNotifications);

// Get a notification by ID
router.get("/:id", notificationController.getNotificationById);

// Update a notification by ID
router.put("/:id", notificationController.updateNotificationById);

// Delete a notification by ID
router.delete("/:id", notificationController.deleteNotificationById);

module.exports = router;
