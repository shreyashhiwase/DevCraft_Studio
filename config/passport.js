// config/passport.js
const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User           = require('../models/User');

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  `${process.env.APP_URL || 'http://localhost:3000'}/auth/google/callback`,
  proxy:        true,   // ← CRITICAL for Render — tells passport to trust X-Forwarded-* headers
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email    = profile.emails?.[0]?.value?.toLowerCase();
    const name     = profile.displayName || profile.name?.givenName || 'User';
    const googleId = profile.id;
    const avatar   = profile.photos?.[0]?.value;

    if (!email) {
      console.error('Google OAuth: no email returned from profile');
      return done(null, false, { message: 'No email returned from Google.' });
    }

    // 1. Existing Google user — just log in
    let user = await User.findOne({ googleId });
    if (user) {
      user.lastLogin    = new Date();
      user.googleAvatar = avatar;
      await user.save({ validateBeforeSave: false });
      return done(null, user);
    }

    // 2. Email exists but was registered locally — link Google to existing account
    user = await User.findOne({ email });
    if (user) {
      user.googleId     = googleId;
      user.googleAvatar = avatar;
      user.isVerified   = true;
      user.authProvider = 'google';
      user.lastLogin    = new Date();
      await user.save({ validateBeforeSave: false });
      return done(null, user);
    }

    // 3. Brand-new user — create account (no password needed for Google users)
    user = new User({
      name,
      email,
      googleId,
      googleAvatar: avatar,
      isVerified:   true,
      authProvider: 'google',
      role:         'user',
    });

    // Skip password validation for Google users
    await user.save({ validateBeforeSave: false });
    console.log(`Google OAuth: new user created — ${email}`);
    return done(null, user);

  } catch (err) {
    console.error('Google OAuth strategy error:', err.message);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (err) {
    done(null, false); // Don't crash — just treat as not logged in
  }
});

module.exports = passport;
