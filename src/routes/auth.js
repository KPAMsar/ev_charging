const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/login", AuthController.Login);
router.post("/register", AuthController.SignUp);
router.post("/checkAvailability", AuthController.CheckPhoneAndMailAvailability);
router.post("/verify-email", AuthController.verifyEmail);

module.exports = router;
