const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  note:      { type: String, required: true },
  user:      { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const caseSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  description:    { type: String, required: true },
  category:       { type: String, required: true },
  urgency:        { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  location:       { type: String, required: true },
  coordinates:    { lat: Number, lng: Number },
  skillRequired:  { type: String },
  status:         { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
  assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updates:        [updateSchema],
  suggestedActions: [{ type: String }],
  reportSent:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
