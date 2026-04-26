const User = require('../models/User');
const { ok, fail } = require('../utils/response');

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  return ok(res, req.user, 'Profile fetched');
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, location, skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, location, skills },
      { new: true, runValidators: true }
    );
    return ok(res, user, 'Profile updated');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/users  (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return ok(res, users, 'Users fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return fail(res, 'User not found', 404);
    return ok(res, user, 'User fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
