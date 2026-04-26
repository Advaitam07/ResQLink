const User = require('../models/User');
const { ok, fail } = require('../utils/response');

// GET /api/settings
exports.getSettings = async (req, res) => {
  return ok(res, req.user.settings || {}, 'Settings fetched');
};

// PUT /api/settings  (full update)
exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id, { settings: req.body }, { new: true });
    return ok(res, user.settings, 'Settings updated');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/settings/notifications
exports.updateNotifications = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'settings.notifications': req.body },
      { new: true }
    );
    return ok(res, user.settings.notifications, 'Notification settings updated');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/settings/preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { language, timezone } = req.body;
    const update = {};
    if (language) update['settings.language'] = language;
    if (timezone) update['settings.timezone'] = timezone;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    return ok(res, { language: user.settings.language, timezone: user.settings.timezone }, 'Preferences updated');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
