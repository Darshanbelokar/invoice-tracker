const express = require('express');
const userRouter = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  getUserByEmail
} = require('../controllers/userController');

userRouter.route('/')
  .post(createUser)
  .get(getUsers);

userRouter.route('/search/email')
  .get(getUserByEmail);

userRouter.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

userRouter.route('/:id/password')
  .put(updatePassword);

module.exports = userRouter;
