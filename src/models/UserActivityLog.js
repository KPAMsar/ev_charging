const mongoose = require("mongoose");

const userActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserActivityLog = mongoose.model(
  "UserActivityLog",
  userActivityLogSchema
);

module.exports = UserActivityLog;
