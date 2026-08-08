const Notification = require("../models/notification.model");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/errors/apiError.utils");

// @desc    Get notifications for logged-in user
// @route   GET /api/v1/notifications
// @access  Private
exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    status: "success",
    unreadCount,
    results: notifications.length,
    data: notifications,
  });
});

// @desc    Mark a notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return next(new ApiError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: notification,
  });
});

// @desc    Mark all notifications as read for logged-in user
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
});

// Helper for internal use to issue notifications
exports.createNotification = async ({ recipient, title, message, type, link }) => {
  try {
    return await Notification.create({
      recipient,
      title,
      message,
      type: type || "system",
      link: link || "",
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
};
