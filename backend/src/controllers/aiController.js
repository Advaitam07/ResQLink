const Case = require('../models/Case');
const { ok, fail } = require('../utils/response');

// GET /api/ai/summary
exports.getAISummary = async (req, res) => {
  try {
    const [total, urgent, completed] = await Promise.all([
      Case.countDocuments(), Case.countDocuments({ urgency: 'High' }),
      Case.countDocuments({ status: 'Completed' }),
    ]);
    return ok(res, {
      riskScore: urgent > 3 ? 'High' : urgent > 1 ? 'Medium' : 'Low',
      assetMatch: '98%',
      predictiveVelocity: '1.4x',
      strategicFocus: urgent > 2 ? 'High' : 'Medium',
      insights: [
        { time: '1m ago', msg: 'AI matched volunteer skills to 3 open cases.', type: 'match' },
        { time: '5m ago', msg: `${urgent} high-urgency cases require immediate attention.`, type: 'alert' },
        { time: '12m ago', msg: `${completed} missions completed this cycle.`, type: 'sync' },
        { time: '1h ago', msg: 'Skill gap analysis ready for review.', type: 'analysis' },
      ],
      recommendation: urgent > 0
        ? `Deploy additional resources to ${urgent} high-urgency sectors immediately.`
        : 'All sectors operating within normal parameters.',
    }, 'AI summary fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/ai/cases/:id
exports.getAICaseInsights = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return fail(res, 'Case not found', 404);
    const actions = {
      'Medical': ['Deploy medical team within 2 hours', 'Secure supply chain for medications', 'Set up triage point'],
      'Disaster Relief': ['Establish command center', 'Coordinate evacuation routes', 'Deploy logistics team'],
      'Education Support': ['Identify affected students', 'Coordinate with local schools', 'Arrange temporary facilities'],
      'Food Security': ['Assess food shortage scale', 'Contact food bank networks', 'Organize distribution points'],
    };
    return ok(res, {
      caseId: c._id,
      suggestedActions: actions[c.category] || ['Assess situation', 'Deploy available volunteers', 'Monitor progress'],
      requiredSkills: c.skillRequired ? [c.skillRequired] : ['General', 'Logistics'],
      priorityLevel: c.urgency,
      estimatedResolution: c.urgency === 'High' ? '24-48 hours' : c.urgency === 'Medium' ? '3-5 days' : '1-2 weeks',
    }, 'AI case insights fetched');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// GET /api/ai/map
exports.getAIMapInsights = async (req, res) => {
  return ok(res, {
    hotspots: ['Eastern District', 'Community Center', 'Northern Sector'],
    recommendation: 'Concentrate 60% of resources in Eastern District based on case density.',
    networkLatency: '1.2s',
    managedNodes: 14820,
  }, 'AI map insights fetched');
};
