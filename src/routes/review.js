const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");

// Create a review
router.post("/", ReviewController.createReview);

// Get all reviews
router.get("/", ReviewController.getAllReviews);

// Get reviews for a specific charging point
router.get("/:id", ReviewController.getReviewsForChargingPoint);

// Update a review
router.put("/:id", ReviewController.updateReview);

// Delete a review
router.delete("/:id", ReviewController.deleteReview);

module.exports = router;
