const express = require('express');
const userRouter = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  getUserByEmail,
  getProfile,
  updateProfile,
  updateCurrentUserPassword
} = require('../controllers/userController');

userRouter.route('/')
  .post(createUser)
  .get(getUsers);

userRouter.route('/search/email')
  .get(getUserByEmail);

// profile endpoints for current authenticated user
userRouter.route('/profile')
  .get(getProfile)
  .put(updateProfile);

userRouter.route('/profile/password')
  .put(updateCurrentUserPassword);

userRouter.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

userRouter.route('/:id/password')
  .put(updatePassword);

module.exports = userRouter;
