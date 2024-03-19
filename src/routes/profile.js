const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profileController");
const Authenticated = require("../middleware/authenticate");

const upload = require("../utils/multer");
router.post(
  "/add-photo",
  upload.single("file"),
  Authenticated,
  ProfileController.updateProfileImg
);

module.exports = router;
