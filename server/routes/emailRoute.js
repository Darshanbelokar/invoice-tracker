const express = require('express');
const router = express.Router();

const emailController = require('../controllers/emailController');

router.post('/invoice', emailController.sendInvoiceEmail);
router.post('/payment-confirmation', emailController.sendPaymentConfirmation);
router.post('/reminder', emailController.sendReminder);

module.exports = router;