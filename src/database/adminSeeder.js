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
        email: "admin@example.com",
        password: "12345",
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
