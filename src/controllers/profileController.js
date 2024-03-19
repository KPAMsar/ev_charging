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
