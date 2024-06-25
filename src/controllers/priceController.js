const Price = require("../models/Price");

// Controller to create a new price
exports.createPrice = async (req, res) => {
  try {
    const { name, value, currency } = req.body;
    if (!name || !value || !currency) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const price = new Price({ name, value, currency });
    await price.save();
    res
      .status(201)
      .json({ success: true, message: "Price created successfully", price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to update an existing price
exports.updatePrice = async (req, res) => {
  try {
    const { name, value, currency } = req.body;
    const priceId = req.params.id;
    const updatedPrice = await Price.findByIdAndUpdate(
      priceId,
      { name, value, currency },
      { new: true }
    );
    res.json({
      success: true,
      message: "Price updated successfully",
      price: updatedPrice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to delete an existing price
exports.deletePrice = async (req, res) => {
  try {
    const priceId = req.params.id;
    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: "Price ID is required",
      });
    }
    await Price.findByIdAndDelete(priceId);
    res.json({ success: true, message: "Price deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to get all prices
exports.getPrices = async (req, res) => {
  try {
    const prices = await Price.find();
    res.json({
      success: true,
      message: "Prices retrieved successfully",
      prices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPriceByDuration = async (req, res) => {
  try {
    const { duration } = req.query;

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Duration is required",
      });
    }

    const price = await Price.findOne({ duration });

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price not found for the specified duration",
      });
    }

    return res.status(200).json({
      success: true,
      data: price,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
// Controller to get a single price by ID
exports.getPriceById = async (req, res) => {
  try {
    const priceId = req.params.id;
    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: "Price ID is required",
      });
    }
    const price = await Price.findById(priceId);
    if (!price) {
      return res
        .status(404)
        .json({ success: false, message: "Price not found" });
    }
    res.json({ success: true, message: "Price retrieved successfully", price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
