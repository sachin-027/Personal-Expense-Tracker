const Income = require('../models/Income');
const ExcelJS = require('exceljs');

// @desc    Add income
// @route   POST /api/income
// @access  Private
exports.addIncome = async (req, res) => {
  try {
    const { source, amount, date, icon } = req.body;

    const income = await Income.create({
      user: req.user._id,
      source,
      amount,
      date,
      icon: icon || ''
    });

    res.status(201).json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all income
// @route   GET /api/income
// @access  Private
exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: income.length,
      data: income
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    // Make sure user owns income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await income.deleteOne();

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

// @desc    Download income as Excel
// @route   GET /api/income/download
// @access  Private
exports.downloadIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user._id }).sort({ date: -1 });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Income');

    // Add headers
    worksheet.columns = [
      { header: 'Source', key: 'source', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    // Add data
    income.forEach(item => {
      worksheet.addRow({
        source: item.source,
        amount: item.amount,
        date: new Date(item.date).toLocaleDateString(),
        createdAt: new Date(item.createdAt).toLocaleString()
      });
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6B46C1' }
    };

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=income-report.xlsx'
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
