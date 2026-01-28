const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    required: [true, 'Please provide income source'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: 0
  },
  date: {
    type: Date,
    required: [true, 'Please provide date'],
    default: Date.now
  },
  icon: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
incomeSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Income', incomeSchema);
