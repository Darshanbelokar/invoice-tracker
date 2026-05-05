const express = require('express');
const paymentRouter = express.Router();

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByStatus
} = require('../controllers/paymentController');

paymentRouter.route('/')
  .post(createPayment)
  .get(getPayments);

paymentRouter.route('/:id')
  .get(getPaymentById)
  .put(updatePayment)
  .delete(deletePayment);

paymentRouter.route('/status/filter')
  .get(getPaymentsByStatus);

module.exports = paymentRouter;
