const Payment = require('../models/payment');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { userId, invoiceId, stripeSessionId, amount, currency, paymentMethod } = req.body;

    if (!userId || !invoiceId || !stripeSessionId || !amount) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newPayment = new Payment({
      userId,
      invoiceId,
      stripeSessionId,
      amount,
      currency: currency || 'INR',
      paymentMethod: paymentMethod || 'card'
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment created successfully', data: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

// Get all payments for a user
exports.getPayments = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const payments = await Payment.find({ userId }).populate('invoiceId');
    res.status(200).json({ message: 'Payments retrieved successfully', data: payments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id).populate('invoiceId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment retrieved successfully', data: payment });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, currency, status, paymentMethod } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { amount, currency, status, paymentMethod },
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment updated successfully', data: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully', data: deletedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
};

// Get payments by status
exports.getPaymentsByStatus = async (req, res) => {
  try {
    const { userId, status } = req.query;

    if (!userId || !status) {
      return res.status(400).json({ message: 'userId and status are required' });
    }

    const payments = await Payment.find({ userId, status }).populate('invoiceId');
    res.status(200).json({ message: 'Payments retrieved successfully', data: payments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};
