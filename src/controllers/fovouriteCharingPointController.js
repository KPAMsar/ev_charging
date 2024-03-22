const Favourite = require("../models/FavouriteChargingPoint");

exports.addToFavourites = async (req, res) => {
  const { chargingPointId } = req.body;
  const userId = req.user.foundUserId;
  if (!userId) {
    return res.send(401).json({
      success: false,
      message: "Unathorized, you need to login",
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
    } else {
      // Add the charging point to existing favourites
      favourite.chargingPoints.push(chargingPointId);
      await favourite.save();
    }

    res
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
    return res.send(401).json({
      success: false,
      message: "Unathorized, you need to login",
    });
  }
  if (!chargingPointId) {
    return res.status(400).json({
      success: false,
      message: "Charging point ID is required",
    });
  }
  try {
    const favourite = await Favourite.findOne({ user: userId });

    if (!favourite) {
      return res
        .status(404)
        .json({ success: false, message: "Favourites not found" });
    }

    // Remove the charging point from favourites
    favourite.chargingPoints.pull(chargingPointId);
    await favourite.save();

    res.json({
      success: true,
      message: "Charging point removed from favourites",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
