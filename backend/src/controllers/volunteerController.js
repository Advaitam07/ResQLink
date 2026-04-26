const User = require('../models/User');
const Case = require('../models/Case');
const { ok, fail } = require('../utils/response');

// POST /api/volunteers
exports.addVolunteer = async (req, res) => {
  try {
    const { name, email, skills, location } = req.body;
    if (await User.findOne({ email })) return fail(res, 'Email already registered');
    const volunteer = await User.create({ name, email, role: 'volunteer', skills, location, status: 'Available' });
    return ok(res, volunteer, 'Volunteer added', 201);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: 'volunteer' };
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
    ];
    const volunteers = await User.find(filter).select('-password');
    // Attach active case count
    const result = await Promise.all(volunteers.map(async (v) => {
      const activeCases = await Case.countDocuments({ assignedTo: v._id, status: 'In Progress' });
      return { ...v.toObject(), activeCases };
    }));
    return ok(res, result, 'Volunteers fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/volunteers/deployed
exports.getDeployedVolunteers = async (req, res) => {
  try {
    const cases = await Case.find({ status: 'In Progress', assignedTo: { $ne: null } })
      .populate('assignedTo', 'name email location skills status');
    const deployed = cases.map(c => ({ ...c.assignedTo?.toObject(), caseId: c._id, caseTitle: c.title, location: c.location }));
    return ok(res, deployed, 'Deployed volunteers fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/volunteers/:id
exports.getVolunteerById = async (req, res) => {
  try {
    const v = await User.findOne({ _id: req.params.id, role: 'volunteer' }).select('-password');
    if (!v) return fail(res, 'Volunteer not found', 404);
    const activeCases = await Case.countDocuments({ assignedTo: v._id, status: 'In Progress' });
    return ok(res, { ...v.toObject(), activeCases }, 'Volunteer fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PUT /api/volunteers/:id
exports.updateVolunteer = async (req, res) => {
  try {
    const v = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!v) return fail(res, 'Volunteer not found', 404);
    return ok(res, v, 'Volunteer updated');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// DELETE /api/volunteers/:id
exports.deleteVolunteer = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return ok(res, null, 'Volunteer removed');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/volunteers/:id/authorize
exports.authorizeVolunteer = async (req, res) => {
  try {
    const v = await User.findByIdAndUpdate(req.params.id, { isAuthorized: true }, { new: true }).select('-password');
    if (!v) return fail(res, 'Volunteer not found', 404);
    return ok(res, v, 'Volunteer authorized');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// PATCH /api/volunteers/:id/availability
exports.toggleAvailability = async (req, res) => {
  try {
    const v = await User.findById(req.params.id);
    if (!v) return fail(res, 'Volunteer not found', 404);
    v.status = v.status === 'Available' ? 'Busy' : 'Available';
    await v.save();
    return ok(res, v, `Status set to ${v.status}`);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
