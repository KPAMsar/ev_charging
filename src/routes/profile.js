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

router.put("/", Authenticated, ProfileController.updateUserInfo);
router.get("hh", (req, res) => {
  res.send("hh");
});

router.put(
  "/info/update",
  upload.single("file"),
  Authenticated,
  ProfileController.updateUserInfo
);

router.get("/info", Authenticated, ProfileController.getUserInfo);

module.exports = router;
