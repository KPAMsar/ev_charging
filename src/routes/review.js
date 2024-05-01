const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");
const Authenticated = require("../middleware/authenticate");

// Create a review
router.post("/", Authenticated, ReviewController.createReview);

// Get all reviews
router.get("/", Authenticated, ReviewController.getAllReviews);

// Get reviews for a specific charging point
router.get("/:id", Authenticated, ReviewController.getReviewsForChargingPoint);

// Update a review
router.put("/:id", Authenticated, ReviewController.updateReview);

// Delete a review
router.delete("/:id", Authenticated, ReviewController.deleteReview);

module.exports = router;
