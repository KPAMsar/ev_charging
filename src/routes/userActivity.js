const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const UserActivityController = require("../controllers/userActivityController");
const Authenticated = require("../middleware/authenticate");

// User Activity Logs Routes
router.post(
  "/user-activity-log",
  Authenticated,
  UserActivityController.logUserActivity
);

router.get(
  "/user-activity-logs",
  Authenticated,
  UserActivityController.getAllUserActivityLogs
);

// User Management Routes
router.get("/users", Authenticated, UserController.listUsers);

router.post("/users", Authenticated, UserController.addUser);

router.get("/users/:userId", Authenticated, UserController.viewUser);

router.put("/users/:userId", Authenticated, UserController.editUser);

router.put(
  "/users/:userId/toggle-status",
  Authenticated,
  UserController.toggleUserStatus
);

router.delete("/users/:userId", Authenticated, UserController.deleteUser);

module.exports = router;
