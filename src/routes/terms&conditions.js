const express = require("express");
const router = express.Router();
const termsAndConditionsController = require("../controllers/t&cController");
const Authorize = require("../middleware/authorize");
const Authenticated = require("../middleware/authenticate");

// Create new terms and conditions
router.post(
  "/",
  Authorize.authorizeUser(["admin", "super-admin"]),
  Authenticated,
  termsAndConditionsController.createTermsAndConditions
);

// Get the latest terms and conditions
router.get("/", termsAndConditionsController.getTermsAndConditions);

// Update terms and conditions
router.put(
  "/:id",
  Authorize.authorizeUser(["admin", "super-admin"]),
  Authenticated,
  termsAndConditionsController.updateTermsAndConditions
);

module.exports = router;
