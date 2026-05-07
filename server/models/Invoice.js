const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  items: [itemSchema],

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['draft', 'pending', 'paid', 'overdue', 'Pending', 'Paid'],
    default: 'pending'
  },

  issueDate: {
    type: Date,
    default: Date.now
  },

  dueDate: {
    type: Date,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);