// config/passport.js — Google OAuth strategy
const passport             = require('passport');
const GoogleStrategy       = require('passport-google-oauth20').Strategy;
const User                 = require('../models/User');

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  `${process.env.APP_URL || 'http://localhost:3000'}/auth/google/callback`,
  scope: ['profile', 'email'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email      = profile.emails?.[0]?.value?.toLowerCase();
    const name       = profile.displayName || profile.name?.givenName || 'User';
    const googleId   = profile.id;
    const avatar     = profile.photos?.[0]?.value;

    if (!email) return done(new Error('No email from Google'), null);

    // 1. Already has a Google account — just log in
    let user = await User.findOne({ googleId });
    if (user) {
      user.lastLogin    = new Date();
      user.googleAvatar = avatar;
      await user.save({ validateBeforeSave: false });
      return done(null, user);
    }

    // 2. Email exists but registered locally — link Google to it
    user = await User.findOne({ email });
    if (user) {
      user.googleId     = googleId;
      user.googleAvatar = avatar;
      user.isVerified   = true;   // Google email is already verified
      user.authProvider = 'google';
      user.lastLogin    = new Date();
      await user.save({ validateBeforeSave: false });
      return done(null, user);
    }

    // 3. Brand new user — create account (auto-verified via Google)
    user = await User.create({
      name,
      email,
      googleId,
      googleAvatar: avatar,
      isVerified:   true,    // Google already verified the email
      authProvider: 'google',
      role:         'user',
    });

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Store only the user ID in session (lightweight)
passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
