const Case = require('../models/Case');
const User = require('../models/User');
const axios = require('axios');
const { ok, fail } = require('../utils/response');

// GET /api/map/cases
exports.getMapCases = async (req, res) => {
  try {
    const cases = await Case.find().select('title location coordinates urgency status assignedTo');
    return ok(res, cases, 'Map cases fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/map/volunteers
exports.getMapVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }).select('name location status skills');
    return ok(res, volunteers, 'Map volunteers fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/map/deployed
exports.getDeployedOnMap = async (req, res) => {
  try {
    const cases = await Case.find({ status: 'In Progress', assignedTo: { $ne: null } })
      .populate('assignedTo', 'name location status');
    return ok(res, cases, 'Deployed cases fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/map/urgent
exports.getUrgentOnMap = async (req, res) => {
  try {
    const cases = await Case.find({ urgency: 'High' }).select('title location coordinates status');
    return ok(res, cases, 'Urgent cases fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/map/search?location=
exports.searchLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return fail(res, 'Location query required');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const { data } = await axios.get(url);
    if (data.status !== 'OK') return fail(res, 'Location not found', 404);
    const result = data.results[0];
    return ok(res, {
      formattedAddress: result.formatted_address,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    }, 'Location found');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/map/summary
exports.getMapSummary = async (req, res) => {
  try {
    const [totalCases, urgentCases, deployedCases, volunteers] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ urgency: 'High' }),
      Case.countDocuments({ status: 'In Progress' }),
      User.countDocuments({ role: 'volunteer', status: 'Available' }),
    ]);
    return ok(res, { totalCases, urgentCases, deployedCases, availableVolunteers: volunteers });
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
