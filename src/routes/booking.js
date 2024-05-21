const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/bookingController");
const Authenticated = require("../middleware/authenticate");

// Create a Booking
// router.post("/", Authenticated, BookingController.createBooking);
// Create a Booking
router.post("/", Authenticated, (req, res) => {
  // Pass the io object to the controller function
  BookingController.createBooking(req, res, req.app.get("io"));
});

// Get All
router.get("/", Authenticated, BookingController.getAllBookings);

router.get(
  "/top-charging-points",
  Authenticated,
  BookingController.getTopChargingPoints
);
router.get(
  "/bookings-by-charging-point",
  Authenticated,
  BookingController.getAllBookingsByChargingPoint
);
// Get Booking by ID
router.get("/:id", Authenticated, BookingController.getBookingById);

// Update a Booking
router.put("/:id", Authenticated, BookingController.updateBooking);

// Delete a Booking
router.delete("/:id", Authenticated, BookingController.deleteBooking);

module.exports = router;
