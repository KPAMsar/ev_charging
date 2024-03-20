const User = require("../../src/models/user");
const Cloudinary = require("../utils/cloudinary");

exports.updateProfileImg = async (req, res) => {
  try {
    if (!req.file) {
      res.send("Image file is required");
      return;
    }

    // Upload image to Cloudinary
    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "Profile",
    });

    // return console.log("user", req.user);
    // Update user profile image URL in the database
    const user = await User.findByIdAndUpdate(
      req.user.foundUserId,
      { picture: result.secure_url },
      { new: true, select: "picture phone_number email role isEmailVerified" }
    );

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;
    let pictureUrl;

    // Check if a picture file is included in the request

    if (req.file) {
      // Upload image to Cloudinary
      const result = await Cloudinary.uploader.upload(req.file.path, {
        folder: "Profile",
      });
      pictureUrl = result.secure_url;
    }

    // Construct update object based on provided user information
    const updateObj = {};
    if (first_name) updateObj.first_name = first_name;
    if (last_name) updateObj.last_name = last_name;
    if (phone_number) updateObj.phone_number = phone_number;
    if (pictureUrl) updateObj.picture = pictureUrl;

    // Update user information in the database

    const updatedUser = await User.findByIdAndUpdate(
      req.user.foundUserId,
      {
        firstname: updateObj.first_name,
        lastname: updateObj.last_name,
        phone_number,
        picture: updateObj.picture,
      },

      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userInfo = await User.findById(req.user.foundUserId)
      .select
      // "picture _id phone_number email role isEmailVerified createdAt"
      ();

    // Check if user information exists
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user information
    return res.status(200).json({
      success: true,
      user: userInfo,
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
