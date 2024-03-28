const express = require("express");
const router = express.Router();
const {
  addToFavourites,
  removeFromFavourites,
  getUserFavourites,
} = require("../controllers/fovouriteCharingPointController");
const Authenticated = require("../middleware/authenticate");

// Route to add a charging point to favourites
router.post("/add", Authenticated, addToFavourites);

// Route to remove a charging point from favourites
router.post("/remove", Authenticated, removeFromFavourites);

// Get favourite charging points
router.get("/", Authenticated, getUserFavourites);

module.exports = router;
