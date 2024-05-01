const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/disable-user/:id", UserController.disableUser);
router.get(
  "/check-phone-number/:phoneNumber",
  UserController.checkPhoneNumberStatus
);
router.get("/check-email/:email", UserController.checkEmailStatus);

module.exports = router;
