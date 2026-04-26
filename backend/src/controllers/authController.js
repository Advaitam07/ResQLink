const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { ok, fail } = require('../utils/response');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return fail(res, 'Email already registered');

    const user = await User.create({ name, email, password, role: role || 'volunteer' });
    return ok(res, { token: generateToken(user._id), user: sanitize(user) }, 'Registration successful', 201);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return fail(res, 'Invalid credentials', 401);
    if (!(await user.matchPassword(password))) return fail(res, 'Invalid credentials', 401);
    if (role && user.role !== role) return fail(res, 'Role mismatch', 401);

    return ok(res, { token: generateToken(user._id), user: sanitize(user) }, 'Login successful');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  return ok(res, sanitize(req.user), 'User fetched');
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  return ok(res, null, 'Logged out successfully');
};

const sanitize = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  skills: u.skills,
  location: u.location,
  status: u.status,
  settings: u.settings,
});
