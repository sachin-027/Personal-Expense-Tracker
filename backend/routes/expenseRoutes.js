const express = require('express');
const router = express.Router();
const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenses
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addExpense);
router.get('/', protect, getAllExpenses);
router.delete('/:id', protect, deleteExpense);
router.get('/download', protect, downloadExpenses);

module.exports = router;
