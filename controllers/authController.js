// controllers/authController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendWelcome } = require('../utils/email');

// @desc  Show register page
// @route GET /auth/register
const getRegister = (req, res) => {
  res.render('auth/register', { title: 'Create Account', errors: [], formData: {} });
};

// @desc  Handle registration
// @route POST /auth/register
const postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Create Account',
      errors: errors.array(),
      formData: req.body
    });
  }

  const { name, email, password, phone } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Create Account',
        errors: [{ msg: 'An account with this email already exists' }],
        formData: req.body
      });
    }

    // Create user
    const user = await User.create({ name, email, password, phone });

    // Set session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    // Send welcome email (non-blocking — never crashes registration on failure)
    sendWelcome(user).catch(e => console.error('Welcome email error:', e.message));

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

// @desc  Show login page
// @route GET /auth/login
const getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', errors: [], formData: {} });
};

// @desc  Handle login
// @route POST /auth/login
const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Login',
      errors: errors.array(),
      formData: req.body
    });
  }

  const { email, password } = req.body;

  try {
    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        formData: req.body
      });
    }

    if (!user.isActive) {
      return res.render('auth/login', {
        title: 'Login',
        errors: [{ msg: 'Your account has been deactivated. Contact support.' }],
        formData: req.body
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Set session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    req.flash('success', `Welcome back, ${user.name}!`);
    
    const redirect = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    res.redirect(redirect);
  } catch (err) {
    console.error('Login error:', err);
    res.render('auth/login', {
      title: 'Login',
      errors: [{ msg: 'Login failed. Please try again.' }],
      formData: req.body
    });
  }
};

// @desc  Handle logout
// @route GET /auth/logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Session destroy error:', err);
    res.redirect('/auth/login');
  });
};

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };
