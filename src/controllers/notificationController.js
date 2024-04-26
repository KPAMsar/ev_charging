const Notification = require("../models/Notification");

const errorHandler = (res, statusCode, message) => {
  console.error(message);
  return res.status(statusCode).json({ success: false, message });
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { message, bookingId, userId } = req.body;

    if (!message || !bookingId || !userId) {
      return errorHandler(
        res,
        400,
        "Message, bookingId, and userId are required"
      );
    }

    const newNotification = new Notification({
      message,
      booking: bookingId,
      user: userId,
    });
    await newNotification.save();

    return res.status(201).json({
      success: true,
      message: "Notification saved successfully",
      data: newNotification,
    });
  } catch (error) {
    return errorHandler(res, 500, "Internal Server Error");
  }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate("user", "booking");
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return errorHandler(res, 500, "Internal Server Error");
  }
};

// Get a notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return errorHandler(res, 404, "Notification not found");
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return errorHandler(res, 500, "Internal Server Error");
  }
};

// Update a notification by ID
exports.updateNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, bookingId, userId } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { message, booking: bookingId, user: userId },
      { new: true }
    );

    if (!notification) {
      return errorHandler(res, 404, "Notification not found");
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return errorHandler(res, 500, "Internal Server Error");
  }
};

// Delete a notification by ID
exports.deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return errorHandler(res, 404, "Notification not found");
    }

    return res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    return errorHandler(res, 500, "Internal Server Error");
  }
};
