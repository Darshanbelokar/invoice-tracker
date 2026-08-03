const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');

// Dynamic base URL for callbacks (Render in production, localhost in development)
const BACKEND_URL = process.env.BACKEND_URL || 'https://invoice-tracker-kdca.onrender.com';

// Debug logs
console.log('Loaded Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'YES' : 'NO (MISSING)');
console.log('Loaded GitHub Client ID:', process.env.GITHUB_CLIENT_ID ? 'YES' : 'NO (MISSING)');

// --- Google Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userEmail = profile.emails?.[0]?.value;

        if (!userEmail) {
          return done(new Error('No email found in Google profile'), null);
        }

        let user = await User.findOne({ email: userEmail });

        if (!user) {
          user = await User.create({
            name: profile.displayName || 'Google User',
            email: userEmail,
            password: '',
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);



module.exports = passport;