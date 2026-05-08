// controllers/authController.js
const crypto = require('crypto');
const User   = require('../models/User');
const { validationResult } = require('express-validator');
const { sendWelcome, sendPasswordReset } = require('../utils/email');

// ─── REGISTER ─────────────────────────────────────────────────────────────
const getRegister = (req, res) =>
  res.render('auth/register', { title: 'Create Account', errors: [], formData: {} });

const postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render('auth/register', { title: 'Create Account', errors: errors.array(), formData: req.body });

  const { name, email, password, phone } = req.body;
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.render('auth/register', {
        title: 'Create Account',
        errors: [{ msg: 'An account with this email already exists' }],
        formData: req.body
      });

    const user = await User.create({ name, email, password, phone });
    req.session.userId   = user._id;
    req.session.userRole = user.role;

    sendWelcome(user).catch(e => console.error('Welcome email:', e.message));

    req.flash('success', `Welcome, ${user.name}! Your account has been created.`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Registration error:', err);
    res.render('auth/register', {
      title: 'Create Account',
      errors: [{ msg: 'Registration failed. Please try again.' }],
      formData: req.body
    });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────
const getLogin = (req, res) =>
  res.render('auth/login', { title: 'Login', errors: [], formData: {} });

const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render('auth/login', { title: 'Login', errors: errors.array(), formData: req.body });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.render('auth/login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        formData: req.body
      });

    if (!user.isActive)
      return res.render('auth/login', {
        title: 'Login',
        errors: [{ msg: 'Your account has been deactivated. Contact support.' }],
        formData: req.body
      });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    req.session.userId   = user._id;
    req.session.userRole = user.role;

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('auth/login', {
      title: 'Login',
      errors: [{ msg: 'Login failed. Please try again.' }],
      formData: req.body
    });
  }
};

// ─── LOGOUT ────────────────────────────────────────────────────────────────
const logout = (req, res) =>
  req.session.destroy(() => res.redirect('/auth/login'));

// ─── FORGOT PASSWORD ───────────────────────────────────────────────────────
const getForgotPassword = (req, res) =>
  res.render('auth/forgot-password', { title: 'Forgot Password', error: null, success: null });

const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim())
    return res.render('auth/forgot-password', {
      title: 'Forgot Password', success: null,
      error: 'Please enter your email address.'
    });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always show success — never reveal if email exists (security best practice)
    const successMsg = "If that email is registered, you'll receive a reset link shortly. Check your inbox (and spam folder).";

    if (!user) {
      // Don't reveal that email doesn't exist
      return res.render('auth/forgot-password', { title: 'Forgot Password', error: null, success: successMsg });
    }

    // Generate a secure random token (raw) — we store the HASHED version
    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken   = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password/${rawToken}`;
    console.log(`🔐 Reset URL for ${user.email}: ${resetURL}`);

    await sendPasswordReset(user, resetURL)
      .catch(e => console.error('Reset email error:', e.message));

    res.render('auth/forgot-password', { title: 'Forgot Password', error: null, success: successMsg });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.render('auth/forgot-password', {
      title: 'Forgot Password', success: null,
      error: 'Something went wrong. Please try again.'
    });
  }
};

// ─── RESET PASSWORD ────────────────────────────────────────────────────────
const getResetPassword = async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }   // not expired
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user)
      return res.render('auth/reset-password', {
        title: 'Reset Password',
        token: null, error: 'This reset link is invalid or has expired. Please request a new one.',
        success: null
      });

    res.render('auth/reset-password', {
      title: 'Reset Password', token, error: null, success: null
    });
  } catch (err) {
    console.error('Get reset page error:', err);
    res.render('auth/reset-password', {
      title: 'Reset Password', token: null,
      error: 'Something went wrong. Please try again.', success: null
    });
  }
};

const postResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Validate
  if (!password || password.length < 6)
    return res.render('auth/reset-password', {
      title: 'Reset Password', token,
      error: 'Password must be at least 6 characters.', success: null
    });

  if (password !== confirmPassword)
    return res.render('auth/reset-password', {
      title: 'Reset Password', token,
      error: 'Passwords do not match.', success: null
    });

  try {
    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password +resetPasswordToken +resetPasswordExpires');

    if (!user)
      return res.render('auth/reset-password', {
        title: 'Reset Password', token: null,
        error: 'Reset link is invalid or has expired. Please request a new one.', success: null
      });

    // Set new password (pre-save hook will hash it)
    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success', '✅ Password reset successfully! Please log in with your new password.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Reset password error:', err);
    res.render('auth/reset-password', {
      title: 'Reset Password', token,
      error: 'Failed to reset password. Please try again.', success: null
    });
  }
};

module.exports = {
  getRegister, postRegister,
  getLogin, postLogin, logout,
  getForgotPassword, postForgotPassword,
  getResetPassword, postResetPassword
};
