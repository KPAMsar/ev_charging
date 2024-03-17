const express = require("express");
const router = express.Router();
const Authorize = require("../middleware/authorize");
const Authenticated = require("../middleware/authenticate");
const PrivacyPolicyController = require("../controllers/privacyPolicyController");

router.post(
  "/",
  Authorize.authorizeUser(["admin", "super-admin"]),
  Authenticated,
  PrivacyPolicyController.createPrivacyPolicy
);

router.get("/", PrivacyPolicyController.getAllPrivacyPolicies);

router.put(
  "/:id",
  Authorize.authorizeUser(["admin", "super-admin"]),
  Authenticated,
  PrivacyPolicyController.updatePrivacyPolicy
);

router.delete(
  "/:id",
  Authorize.authorizeUser(["admin", "super-admin"]),
  Authenticated,
  PrivacyPolicyController.deletePrivacyPolicy
);

router.get("/:id", PrivacyPolicyController.getPrivacyPolicyById);

module.exports = router;
