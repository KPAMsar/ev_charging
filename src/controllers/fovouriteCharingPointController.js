const Favourite = require("../models/FavouriteChargingPoint");

exports.addToFavourites = async (req, res) => {
  const { chargingPointId } = req.body;
  const userId = req.user.foundUserId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, you need to login",
    });
  }

  if (!chargingPointId) {
    return res.status(400).json({
      success: false,
      message: "Charging point ID is required",
    });
  }

  try {
    let favourite = await Favourite.findOne({ user: userId });

    if (!favourite) {
      // Create a new favourite entry if one doesn't exist for the user
      favourite = new Favourite({
        user: userId,
        chargingPoints: [chargingPointId],
      });
      await favourite.save();
      return res
        .status(201)
        .json({ success: true, message: "Charging point added to favourites" });
    }

    // Check if the charging point already exists in the user's favourites
    if (favourite.chargingPoints.includes(chargingPointId)) {
      return res.status(400).json({
        success: false,
        message: "Charging point already added to favourites",
      });
    }

    // Add the charging point to existing favourites
    favourite.chargingPoints.push(chargingPointId);
    await favourite.save();

    return res
      .status(201)
      .json({ success: true, message: "Charging point added to favourites" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeFromFavourites = async (req, res) => {
  const { chargingPointId } = req.body;
  const userId = req.user.foundUserId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, you need to login",
    });
  }

  if (!chargingPointId) {
    return res.status(400).json({
      success: false,
      message: "Charging point ID is required",
    });
  }

  try {
    const favourite = await Favourite.findOneAndDelete({
      user: userId,
      chargingPoints: chargingPointId,
    });

    if (!favourite) {
      return res
        .status(404)
        .json({ success: false, message: "Favorites not found" });
    }

    res.json({
      success: true,
      message: "Charging point removed from favorites",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserFavourites = async (req, res) => {
  const userId = req.user.foundUserId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, you need to login",
    });
  }

  try {
    const favourite = await Favourite.findOne({ user: userId }).populate(
      "chargingPoints"
    );

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: "Favourites not found for this user",
      });
    }

    res.json({
      success: true,
      data: favourite,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
