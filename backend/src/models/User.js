const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, select: false },
  role:       { type: String, enum: ['admin', 'coordinator', 'volunteer'], default: 'volunteer' },
  avatar:     { type: String, default: '' },
  skills:     [{ type: String }],
  location:   { type: String },
  status:     { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Available' },
  isAuthorized: { type: Boolean, default: true },
  settings: {
    notifications: {
      caseAlerts:  { type: Boolean, default: true },
      assignments: { type: Boolean, default: true },
      updates:     { type: Boolean, default: false },
    },
    security: {
      twoFactor:      { type: Boolean, default: false },
      sessionTimeout: { type: String, default: '30' },
    },
    language:  { type: String, default: 'english' },
    timezone:  { type: String, default: 'UTC+5:30' },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
