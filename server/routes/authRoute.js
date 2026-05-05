const express = require('express');
const authRouter = express.Router();

const {
  register,
  login,
  verifyToken,
  logout,
  refreshToken
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

module.exports = authRouter;
