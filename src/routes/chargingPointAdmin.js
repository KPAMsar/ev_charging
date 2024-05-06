const express = require("express");
const router = express.Router();
const ChargingPointAdminController = require("../controllers/chargingPointAdminController");
const Authenticated = require("../middleware/authenticate");

router.get(
  "/",
  Authenticated,
  ChargingPointAdminController.getAllChargingPointAdmins
);
module.exports = router;
