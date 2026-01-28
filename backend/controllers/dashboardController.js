const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all income and expenses
    const allIncome = await Income.find({ user: userId });
    const allExpenses = await Expense.find({ user: userId });

    // Calculate totals
    const totalIncome = allIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);
    const totalBalance = totalIncome - totalExpenses;

    // Get recent transactions (5 latest expenses)
    const recentTransactions = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    // Get last 30 days expenses
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const last30DaysExpenses = await Expense.find({
      user: userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Get last 60 days income
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const last60DaysIncome = await Income.find({
      user: userId,
      date: { $gte: sixtyDaysAgo }
    }).sort({ date: 1 });

    // Group expenses by category
    const expensesByCategory = {};
    allExpenses.forEach(expense => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount;
      } else {
        expensesByCategory[expense.category] = expense.amount;
      }
    });

    // Group income by source
    const incomeBySource = {};
    allIncome.forEach(income => {
      if (incomeBySource[income.source]) {
        incomeBySource[income.source] += income.amount;
      } else {
        incomeBySource[income.source] = income.amount;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBalance,
          totalIncome,
          totalExpenses
        },
        recentTransactions,
        last30DaysExpenses,
        last60DaysIncome,
        expensesByCategory,
        incomeBySource
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
