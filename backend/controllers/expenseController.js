const Expense = require('../models/Expense');
const ExcelJS = require('exceljs');

// @desc    Add expense
// @route   POST /api/expense
// @access  Private
exports.addExpense = async (req, res) => {
  try {
    const { category, amount, date, icon, description } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      category,
      amount,
      date,
      icon: icon || '',
      description: description || ''
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all expenses
// @route   GET /api/expense
// @access  Private
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expense/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Download expenses as Excel
// @route   GET /api/expense/download
// @access  Private
exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expenses');

    // Add headers
    worksheet.columns = [
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    // Add data
    expenses.forEach(item => {
      worksheet.addRow({
        category: item.category,
        amount: item.amount,
        date: new Date(item.date).toLocaleDateString(),
        description: item.description || '',
        createdAt: new Date(item.createdAt).toLocaleString()
      });
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEF4444' }
    };

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=expense-report.xlsx'
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
