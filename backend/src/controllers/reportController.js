const Case = require('../models/Case');
const User = require('../models/User');
const Report = require('../models/Report');
const { ok, fail } = require('../utils/response');

// GET /api/reports/summary
exports.getSummary = async (req, res) => {
  try {
    const [total, completed, urgent, volunteers] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: 'Completed' }),
      Case.countDocuments({ urgency: 'High' }),
      User.countDocuments({ role: 'volunteer' }),
    ]);
    return ok(res, { totalCases: total, completedCases: completed, urgentCases: urgent,
      activeVolunteers: volunteers, successRate: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%' });
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/reports/status
exports.getStatusBreakdown = async (req, res) => {
  try {
    const [open, inProgress, completed] = await Promise.all([
      Case.countDocuments({ status: 'Open' }),
      Case.countDocuments({ status: 'In Progress' }),
      Case.countDocuments({ status: 'Completed' }),
    ]);
    return ok(res, [
      { name: 'Open', value: open, color: '#3b82f6' },
      { name: 'In Progress', value: inProgress, color: '#f59e0b' },
      { name: 'Completed', value: completed, color: '#10b981' },
    ]);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/reports/category
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const data = await Case.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);
    return ok(res, data);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// POST /api/reports/generate
exports.generateReport = async (req, res) => {
  try {
    const [total, completed, urgent, volunteers] = await Promise.all([
      Case.countDocuments(), Case.countDocuments({ status: 'Completed' }),
      Case.countDocuments({ urgency: 'High' }), User.countDocuments({ role: 'volunteer' }),
    ]);
    const categoryData = await Case.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);
    const report = await Report.create({
      title: `ResQLink Report - ${new Date().toLocaleDateString()}`,
      generatedBy: req.user._id,
      summary: { totalCases: total, completedCases: completed, urgentCases: urgent,
        activeVolunteers: volunteers, successRate: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%' },
      categoryBreakdown: categoryData,
    });
    return ok(res, report, 'Report generated', 201);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/reports/export
exports.exportReport = async (req, res) => {
  try {
    const cases = await Case.find().populate('assignedTo', 'name');
    const csv = [
      'ID,Title,Category,Urgency,Status,Location,Assigned To,Created At',
      ...cases.map(c => `${c._id},"${c.title}","${c.category}",${c.urgency},${c.status},"${c.location}","${c.assignedTo?.name || 'Unassigned'}",${c.createdAt.toISOString()}`),
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=resqlink-report.csv');
    return res.send(csv);
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
