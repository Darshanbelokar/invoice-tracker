const express = require('express');
const authRouter = express.Router();

const {
  register,
  login,
  verifyToken,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

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

module.exports = authRouter;
