const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide expense category'],
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
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
