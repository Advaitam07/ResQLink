const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  summary: {
    totalCases:     Number,
    completedCases: Number,
    urgentCases:    Number,
    activeVolunteers: Number,
    successRate:    String,
  },
  categoryBreakdown: [{ name: String, count: Number }],
  statusBreakdown:   [{ name: String, value: Number }],
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
