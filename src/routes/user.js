const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/disable-user", UserController.disableUser);

module.exports = router;
