const Case = require('../models/Case');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { ok, fail } = require('../utils/response');

// POST /api/cases
exports.createCase = async (req, res) => {
  try {
    const { title, description, category, urgency, location, coordinates, skillRequired } = req.body;
    const newCase = await Case.create({
      title, description, category, urgency, location, coordinates, skillRequired,
      createdBy: req.user._id,
      updates: [{ note: 'Case opened.', user: req.user.name }]
    });
    return ok(res, newCase, 'Case created', 201);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/cases
exports.getCases = async (req, res) => {
  try {
    const { status, urgency, location, search } = req.query;
    const filter = {};
    if (status)   filter.status = status;
    if (urgency)  filter.urgency = urgency;
    if (location) filter.location = new RegExp(location, 'i');
    if (search)   filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
    ];
    const cases = await Case.find(filter).populate('assignedTo', 'name email role').sort('-createdAt');
    return ok(res, cases, 'Cases fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/cases/stats/summary
exports.getCaseStats = async (req, res) => {
  try {
    const [total, completed, inProgress, open, urgent] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: 'Completed' }),
      Case.countDocuments({ status: 'In Progress' }),
      Case.countDocuments({ status: 'Open' }),
      Case.countDocuments({ urgency: 'High' }),
    ]);
    return ok(res, { total, completed, inProgress, open, urgent,
      successRate: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%' }, 'Stats fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/cases/:id
exports.getCaseById = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id).populate('assignedTo', 'name email role skills');
    if (!c) return fail(res, 'Case not found', 404);
    return ok(res, c, 'Case fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PUT /api/cases/:id
exports.updateCase = async (req, res) => {
  try {
    const { title, description, category, urgency, location, coordinates, skillRequired, status } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (urgency) updateData.urgency = urgency;
    if (location) updateData.location = location;
    if (coordinates) updateData.coordinates = coordinates;
    if (skillRequired) updateData.skillRequired = skillRequired;
    if (status) updateData.status = status;

    const c = await Case.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!c) return fail(res, 'Case not found', 404);
    return ok(res, c, 'Case updated');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// DELETE /api/cases/:id
exports.deleteCase = async (req, res) => {
  try {
    const c = await Case.findByIdAndDelete(req.params.id);
    if (!c) return fail(res, 'Case not found', 404);
    return ok(res, null, 'Case deleted');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/cases/:id/assign
exports.assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) return fail(res, 'Volunteer not found', 404);

    const c = await Case.findByIdAndUpdate(req.params.id,
      { assignedTo: volunteerId, status: 'In Progress',
        $push: { updates: { note: `Operative ${volunteer.name} deployed.`, user: req.user.name } } },
      { new: true }).populate('assignedTo', 'name email role');

    // Notify volunteer
    await Notification.create({ user: volunteerId, title: 'Mission Assigned',
      message: `You have been assigned to: ${c.title}`, type: 'assignment', caseId: c._id });

    return ok(res, c, 'Volunteer assigned');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/cases/:id/send-report
exports.sendReport = async (req, res) => {
  try {
    const c = await Case.findByIdAndUpdate(req.params.id,
      { reportSent: true, $push: { updates: { note: 'Report sent to stakeholders.', user: req.user.name } } },
      { new: true });
    if (!c) return fail(res, 'Case not found', 404);
    return ok(res, c, 'Report sent');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
