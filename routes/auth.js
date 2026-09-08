// routes/auth.js
const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const { body } = require('express-validator');
const {
  getRegister, postRegister,
  verifyEmail, resendVerification,
  getLogin, postLogin, logout,
  getForgotPassword, postForgotPassword,
  getResetPassword, postResetPassword,
} = require('../controllers/authController');
const { ensureGuest } = require('../middleware/auth');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Minimum 6 characters'),
  body('confirmPassword').custom((v, { req }) => {
    if (v !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
  // Checkboxes are omitted from the request body entirely when unchecked,
  // so `.exists()` alone is enough to reject an unaccepted registration.
  body('termsAccepted')
    .exists({ checkFalsy: true })
    .withMessage('You must agree to the Terms of Service and Privacy Policy to create an account.'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];

// ── Local auth ───────────────────────────────────────────────────────────
router.get ('/register',              ensureGuest, getRegister);
router.post('/register',              ensureGuest, registerRules, postRegister);
router.get ('/verify-email/:token',   verifyEmail);
router.get ('/resend-verification',   resendVerification);
router.post('/resend-verification',   resendVerification);
router.get ('/login',                 ensureGuest, getLogin);
router.post('/login',                 ensureGuest, loginRules, postLogin);
router.get ('/logout',                logout);
router.get ('/forgot-password',       ensureGuest, getForgotPassword);
router.post('/forgot-password',       ensureGuest, postForgotPassword);
router.get ('/reset-password/:token', ensureGuest, getResetPassword);
router.post('/reset-password/:token', ensureGuest, postResetPassword);

// ── Google OAuth ──────────────────────────────────────────────────────────
// Step 1 — redirect user to Google consent screen
router.get('/google',
  ensureGuest,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',   // always show account picker
  })
);

// Step 2 — Google redirects back here after user consents
router.get('/google/callback',
  // Use custom callback so WE handle errors — not passport's default 500 crash
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      // ── Hard error (DB crash, network issue, etc.) ──────────────────
      if (err) {
        console.error('Google OAuth callback error:', err.message);
        req.flash('error', 'Google sign-in failed due to a server error. Please try again.');
        return res.redirect('/auth/login');
      }

      // ── Soft failure (no email, cancelled, etc.) ────────────────────
      if (!user) {
        const msg = info?.message || 'Google sign-in was cancelled or failed.';
        console.warn('Google OAuth: no user returned —', msg);
        req.flash('error', msg);
        return res.redirect('/auth/login');
      }

      // ── Block inactive accounts ─────────────────────────────────────
      if (!user.isActive) {
        req.flash('error', 'Your account has been deactivated. Contact support.');
        return res.redirect('/auth/login');
      }

      // ── Log in via Passport FIRST ────────────────────────────────────
      // Passport 0.6+ regenerates req.session inside req.logIn() to guard
      // against session fixation — which wipes out anything set on the
      // session beforehand. So our custom session fields must be set
      // AFTER req.logIn() completes, not before it.
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('req.logIn error:', loginErr.message);
          req.flash('error', 'Google sign-in failed due to a server error. Please try again.');
          return res.redirect('/auth/login');
        }

        // Set our own session variables (same format as local login) —
        // now safe, since the session has already been regenerated.
        req.session.userId   = user._id;
        req.session.userRole = user.role;

        req.flash('success', `Welcome${user.authProvider === 'google' ? ' via Google' : ''}, ${user.name}! 🎉`);

        // Explicitly save before redirecting — avoids a race between the
        // MongoStore write and the browser following the redirect.
        req.session.save((saveErr) => {
          if (saveErr) console.error('Session save error after Google login:', saveErr.message);
          return res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        });
      });

    })(req, res, next);
  }
);

module.exports = router;
