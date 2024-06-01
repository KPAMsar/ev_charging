const express = require("express");
const Authenticated = require("../middleware/authenticate");

const {
  createNotification,
  getAllNotifications,
  getNotificationsByUser,
  getNotificationById,
  markNotificationAsRead,
  updateNotificationById,
  deleteNotificationById,
  getNotificationsByChargingPoint,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/", Authenticated, createNotification);
router.get("/", Authenticated, getAllNotifications);
router.get("/charging-point", getNotificationsByChargingPoint);
router.get("/user/:userId", Authenticated, getNotificationsByUser);
router.get("/:id", Authenticated, getNotificationById);
router.put("/:id/read", Authenticated, markNotificationAsRead);
router.put("/:id", Authenticated, updateNotificationById);
router.delete("/:id", Authenticated, deleteNotificationById);

module.exports = router;
