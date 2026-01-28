const express = require('express');
const router = express.Router();
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncome
} = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addIncome);
router.get('/', protect, getAllIncome);
router.delete('/:id', protect, deleteIncome);
router.get('/download', protect, downloadIncome);

module.exports = router;
