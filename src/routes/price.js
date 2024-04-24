const express = require("express");
const router = express.Router();
const {
  createPrice,
  updatePrice,
  deletePrice,
  getPrices,
  getPriceById,
} = require("../controllers/priceController");
const Authenticated = require("../middleware/authenticate");

// Route to create a new price
router.post("/", Authenticated, createPrice);

// Route to update an existing price by ID
router.put("/:id", Authenticated, updatePrice);

// Route to delete an existing price by ID
router.delete("/:id", Authenticated, deletePrice);

// Route to get all
router.get("/", Authenticated, getPrices);

// Route to get a single price by ID
router.get("/:id", Authenticated, getPriceById);

module.exports = router;
