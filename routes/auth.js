// routes/auth.js
const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const {
  getRegister, postRegister,
  getLogin, postLogin, logout,
  getForgotPassword, postForgotPassword,
  getResetPassword, postResetPassword
} = require('../controllers/authController');
const { ensureGuest } = require('../middleware/auth');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('Passwords do not match');
    return true;
  })
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Auth
router.get ('/register',                   ensureGuest, getRegister);
router.post('/register',                   ensureGuest, registerValidation, postRegister);
router.get ('/login',                      ensureGuest, getLogin);
router.post('/login',                      ensureGuest, loginValidation, postLogin);
router.get ('/logout',                     logout);

// Password reset
router.get ('/forgot-password',            ensureGuest, getForgotPassword);
router.post('/forgot-password',            ensureGuest, postForgotPassword);
router.get ('/reset-password/:token',      ensureGuest, getResetPassword);
router.post('/reset-password/:token',      ensureGuest, postResetPassword);

module.exports = router;
