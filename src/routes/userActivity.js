const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userActivityController");
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
  UserActivityController.logUserActivity
);

// User Management Routes
router.get("/", Authenticated, UserController.listUsers);

router.post("/", Authenticated, UserController.addUser);

router.get("/:userId", Authenticated, UserController.viewUser);

router.put("/:userId", Authenticated, UserController.editUser);

router.put(
  "/:userId/toggle-status",
  Authenticated,
  UserController.toggleUserStatus
);

router.delete("/:userId", Authenticated, UserController.deleteUser);

module.exports = router;
