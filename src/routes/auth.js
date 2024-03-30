const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const Authorize = require("../middleware/authorize");
const Authenticate = require("../middleware/authenticate");

router.post("/login", AuthController.Login);
router.post("/register", AuthController.SignUp);
router.post("/checkAvailability", AuthController.CheckPhoneAndMailAvailability);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/verify-admin", AuthController.adminVerifyEmail);
router.post("/send-reset-password", AuthController.SendResetPasswordEmail);
router.post("/verify-reset-password", AuthController.verifyResetPasswordOTP);
router.post("/reset-my-password", AuthController.ResetMyPassword);
router.post(
  "/change-password",
  Authenticate,

  AuthController.ChangePassword
);
router.get("/get-logged-user", Authenticate, AuthController.getLoggedInUser);

module.exports = router;
