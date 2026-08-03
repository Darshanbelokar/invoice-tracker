const express = require('express');
const passport = require('passport');
const authRouter = express.Router();

const {
  register,
  login,
  verifyToken,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  oauthCallback
} = require('../controllers/authController');

// Client URL dynamic fallback (production Vercel vs local development)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Existing Auth Routes
authRouter.route('/register')
  .post(register);

authRouter.route('/login')
  .post(login);

authRouter.route('/verify')
  .get(verifyToken);

authRouter.route('/logout')
  .post(logout);

authRouter.route('/refresh')
  .post(refreshToken);

authRouter.route('/forgot-password')
  .post(forgotPassword);

authRouter.route('/reset-password')
  .post(resetPassword);

// --- Google OAuth Routes ---
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${CLIENT_URL}/login?error=OAuthFailed` 
  }),
  oauthCallback
);

// --- GitHub OAuth Routes ---
authRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { 
    session: false, 
    failureRedirect: `${CLIENT_URL}/login?error=OAuthFailed` 
  }),
  oauthCallback
);

module.exports = authRouter;