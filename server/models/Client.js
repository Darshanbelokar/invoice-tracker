const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  address: String
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);