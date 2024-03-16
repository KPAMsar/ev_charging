const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const Authorize = require("../middleware/authorize");
const Authenticated = require("../middleware/authenticate");

// Create a new FAQ
router.post(
  "/",
  Authenticated,
  Authorize.authorizeUser(["admin", "super-admin"]),
  faqController.createFAQ
);

// Get all FAQs
router.get("/", faqController.getAllFAQs);

// Get a FAQ by ID
router.get("/:id", faqController.getFAQById);

// Update a FAQ
router.put(
  "/:id",
  Authenticated,
  Authorize.authorizeUser(["admin", "super-admin"]),
  faqController.updateFAQ
);

// Delete a FAQ
router.delete(
  "/:id",
  Authenticated,
  Authorize.authorizeUser(["admin", "super-admin"]),
  faqController.deleteFAQ
);

module.exports = router;
