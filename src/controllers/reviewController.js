const Review = require("../models/Review");
const ChargingPoint = require("../models/ChargingPoint");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const userId = req.user.foundUserId;
    const { chargingPointId, rating, comment } = req.body;
    if (!chargingPointId || !userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Charging point ID, user ID, rating, and comment are required",
      });
    }

    // Check if the charging point exists
    const chargingPointMatch = await ChargingPoint.findOne({
      _id: chargingPointId,
    });
    if (!chargingPointMatch) {
      return res.status(404).json({
        success: false,
        message: "Charging point does not exist",
      });
    }

    // Create a new review
    const newReview = new Review({
      chargingPoint: chargingPointId,
      user: userId,
      rating,
      comment,
    });
    await newReview.save();

    chargingPointMatch.reviews = [
      ...(chargingPointMatch.reviews || []),
      newReview._id,
    ];

    await chargingPointMatch.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("chargingPoint");
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get reviews for a specific charging point
exports.getReviewsForChargingPoint = async (req, res) => {
  try {
    const chargingPointId = req.params.id;
    if (!chargingPointId) {
      return res
        .status(400)
        .json({ success: false, message: "Charging point ID is required" });
    }
    const reviews = await Review.find({ chargingPoint: chargingPointId });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!id || (!rating && !comment)) {
      return res.status(400).json({
        success: false,
        message: "Review ID and either rating or comment is required",
      });
    }
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );
    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Review ID is required" });
    }
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
