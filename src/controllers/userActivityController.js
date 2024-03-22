const User = require("../models/user");
const UserActivityLog = require("../models/UserActivityLog");

// Function to log user activity
const logUserActivity = async (userId, activity) => {
  try {
    const userActivityLog = new UserActivityLog({
      userId,
      activity,
      timestamp: new Date(),
    });
    await userActivityLog.save();
    console.log("User activity logged successfully");
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

// Function to list all users
const listUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error listing users:", error);
    return [];
  }
};

// Function to add a new user
const addUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Function to view user details
const viewUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Error viewing user:", error);
    return null;
  }
};

// Function to edit user details
const editUser = async (userId, userData) => {
  try {
    await User.findByIdAndUpdate(userId, userData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error editing user:", error);
  }
};

// Function to activate or deactivate user
const toggleUserStatus = async (userId, isActive) => {
  try {
    await User.findByIdAndUpdate(userId, { isActive });
    console.log(`User ${isActive ? "activated" : "deactivated"} successfully`);
  } catch (error) {
    console.error("Error toggling user status:", error);
  }
};

// Function to delete a user
const deleteUser = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

module.exports = {
  logUserActivity,
  listUsers,
  addUser,
  viewUser,
  editUser,
  toggleUserStatus,
  deleteUser,
};
