const express = require("express");
const router = express.Router();
const ChargingPointAdminController = require("../controllers/chargingPointAdminController");
const AdminController = require('../controllers/adminUserController')
const Authenticated = require("../middleware/authenticate");

router.get(
  "/",
  Authenticated,
  ChargingPointAdminController.getAllChargingPointAdmins
);
router.post(
  "/",
  Authenticated,
  AdminController.addStationAdmin
);

module.exports = router;
