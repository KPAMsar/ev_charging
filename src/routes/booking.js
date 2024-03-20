const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/bookingController");

// Create a Booking
router.post("/", BookingController.createBooking);

// Get All
router.get("/", BookingController.getAllBookings);

// Get Booking by ID
router.get("/:id", BookingController.getBookingById);

// Update a Booking
router.put("/:id", BookingController.updateBooking);

// Delete a Booking
router.delete("/:id", BookingController.deleteBooking);

module.exports = router;
