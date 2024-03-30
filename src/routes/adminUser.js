const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminUserController");
const AuthController = require("../controllers/authController");

// Define routes
router.post("/register-admin", AuthController.SignUp);
router.post("/verify-email", AdminController.adminVerifyEmail);
router.post("/verify-me", AuthController.adminVerifyEmail);
router.post("/disable-admin", AdminController.disableAdmin);
router.get("/admin-users", AdminController.getAllAdmins);

module.exports = router;
