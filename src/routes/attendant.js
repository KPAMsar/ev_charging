const express = require("express");
const router = express.Router();
const AttendantController = require("../controllers/attendantController");

router.get("/get-attendants", AttendantController.fetchAttendantUsers);
router.get("/disable-attendant", AttendantController.disableAttendant);
router.post("/add-attendant", AttendantController.addAttendant);

module.exports = router;
