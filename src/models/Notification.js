const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chargingPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chargingPoint",
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "alert", "message"],
      default: "info",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
    },
    url: {
      type: String,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
