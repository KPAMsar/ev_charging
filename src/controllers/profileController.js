const User = require("../../src/models/user");
const Cloudinary = require("../utils/cloudinary");

const updateProfileImg = async (req, res) => {
  try {
    if (!req.file) {
      res.send("Image file is required");
      return;
    }
    // Upload image to Cloudinary
    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "Profile",
    });

    // Update user profile image URL in the database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImg: result.secure_url },
      { new: true }
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

module.exports = {
  updateProfileImg,
};
