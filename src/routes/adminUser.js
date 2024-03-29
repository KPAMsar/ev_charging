const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminUserController");

router.post("/register-admin", AdminController.adminSignUp);
router.post("/verify-email", AdminController.adminVerifyEmail);
router.post("/disable-admin", AdminController.disableAdmin);
router.get("/admin-users", AdminController.getAllAdmins);

module.exports = router;
