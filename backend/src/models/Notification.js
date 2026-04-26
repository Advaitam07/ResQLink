const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  type:    { type: String, enum: ['case', 'assignment', 'update', 'alert'], default: 'update' },
  read:    { type: Boolean, default: false },
  caseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
