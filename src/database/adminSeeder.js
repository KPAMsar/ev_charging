const User = require("../models/user");
const bcrypt = require("bcrypt");

const LoadUsers = async () => {
  try {
    pwd = "password";
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const users = await User.find();
    if (users.length > 0) {
      // console.log("Users already seeded", users);
      const newUser = new User({
        name: "Super-Admin User",
        email: "superadmin@gmail.com",
        isEmailVerified: true,
        password: hashedPassword,
        role: "super-admin",
      });
      const result = await newUser.save();
    } else {
      const newUser = new User({
        name: "Super-Admin User",
        email: "superadmin@gmail.com",
        isEmailVerified: true,
        password: hashedPassword,
        role: "super-admin",
      });
      const result = await newUser.save();
      console.log("Database seeded successfully with i", result);
    }
  } catch (err) {
    console.error("Error while seeding database:", err);
  }
};

module.exports = LoadUsers;
