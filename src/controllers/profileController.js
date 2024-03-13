const User = require("../../src/models/user");
const Cloudinary = require("../utils/cloudinary");

const updateProfileImg = async (req, res) => {
  const result = await Cloudinary.uploader.upload(req.file.path, {
    folder: "Profile",
  });
};

module.exports = {
  updateProfileImg,
};
