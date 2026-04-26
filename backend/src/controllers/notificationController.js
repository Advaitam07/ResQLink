const Notification = require('../models/Notification');
const { ok, fail } = require('../utils/response');

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
    return ok(res, notes, 'Notifications fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// POST /api/notifications
exports.createNotification = async (req, res) => {
  try {
    const note = await Notification.create({ ...req.body, user: req.user._id });
    return ok(res, note, 'Notification created', 201);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const note = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, { read: true }, { new: true });
    if (!note) return fail(res, 'Notification not found', 404);
    return ok(res, note, 'Marked as read');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    return ok(res, null, 'All notifications marked as read');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
