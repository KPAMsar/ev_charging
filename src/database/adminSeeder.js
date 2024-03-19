const User = require("../models/user");
const bcrypt = require("bcrypt");

const LoadUsers = async () => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      console.log("Users already seeded", users);
    } else {
      const newUser = new User({
        name: "Admin User",
        email: "kpamdev@gmail.com",
        password:
          "$2b$10$qZaDPR3koVncOKvTVcpKn.24WNTcTan0U9eX8DQvMyFzqhgsQKTZm",
        role: "admin",
      });
      const result = await newUser.save();
      console.log("Database seeded successfully with i", result);
    }
  } catch (err) {
    console.error("Error while seeding database:", err);
  }
};

module.exports = LoadUsers;
