// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: [true,'Name is required'], trim: true, maxlength: 100 },
  email:    { type: String, required: [true,'Email is required'], unique: true,
              lowercase: true, trim: true,
              match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'] },
  password: { type: String, minlength: 6, select: false },  // not required — Google users have no password
  role:     { type: String, enum: ['user','admin'], default: 'user' },
  phone:    { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  lastLogin:{ type: Date },

  // ── Google OAuth ─────────────────────────────────────────────
  googleId:    { type: String, unique: true, sparse: true }, // sparse = nulls not indexed
  googleAvatar:{ type: String },                             // profile picture URL from Google
  authProvider:{ type: String, enum: ['local','google'], default: 'local' },

  // ── Email verification ────────────────────────────────────────
  isVerified:         { type: Boolean, default: false },
  emailVerifyToken:   { type: String, select: false },
  emailVerifyExpires: { type: Date,   select: false },

  // ── Password reset ────────────────────────────────────────────
  resetPasswordToken:   { type: String, select: false },
  resetPasswordExpires: { type: Date,   select: false },

  // ── Legal acceptance (Terms of Service / Privacy Policy) ───────
  // Existing accounts created before this field existed simply have
  // `termsAccepted: false` by default — they are not required to
  // re-accept, and nothing else in the app checks this field.
  termsAccepted:         { type: Boolean, default: false },
  privacyPolicyAccepted: { type: Boolean, default: false },
  termsAcceptedAt:       { type: Date },

}, { timestamps: true });

// Hash password before saving (only when modified and exists)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
