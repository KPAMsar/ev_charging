const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/disable-user/:id", UserController.disableUser);
router.get("/delete-user/:id", UserController.deleteUser);
router.get("/activate-user/:id", UserController.activateUser);
router.get(
  "/check-phone-number/:phoneNumber",
  UserController.checkPhoneNumberStatus
);
router.get("/check-email/:email", UserController.checkEmailStatus);
router.get("/users", UserController.getAllUsers);
module.exports = router;
