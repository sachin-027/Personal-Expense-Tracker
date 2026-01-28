import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axios';
import { apiPaths } from '../utils/apiPath';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, X, Download, Trash2 } from 'lucide-react';

const expenseIcons = ['🛍️', '✈️', '💡', '🏦', '🚗', '🍔', '🎬', '🏥', '📚', '🏠', '👕', '⚽'];

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: expenseIcons[0],
    description: ''
  });
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(apiPaths.getAllExpenses);
      setExpenses(response.data.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.date) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await axiosInstance.post(apiPaths.addExpense, formData);
      setShowAddModal(false);
      setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: expenseIcons[0],
        description: ''
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axiosInstance.delete(apiPaths.deleteExpense(id));
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(apiPaths.downloadExpenses, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense-report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Failed to download report');
    }
  };

  // Prepare chart data - group by date for line chart
  const chartDataMap = {};
  expenses.forEach(expense => {
    const date = new Date(expense.date).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    });
    chartDataMap[date] = (chartDataMap[date] || 0) + expense.amount;
  });

  const chartData = Object.entries(chartDataMap)
    .slice(0, 15)
    .map(([date, amount]) => ({ date, amount }))
    .reverse();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expense data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Expense Overview Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Expense Overview</h2>
              <p className="text-gray-500 text-sm">Track your spending trends over time and gain insights into where your money goes.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#6B46C1" 
                strokeWidth={3}
                dot={{ fill: '#6B46C1', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* All Expenses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">All Expenses</h2>
            <button
              onClick={handleDownload}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-2 text-sm font-medium"
            >
              <Download size={18} />
              Download
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No expense records yet. Add your first expense!</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Expense
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="relative group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  onMouseEnter={() => setHoveredId(expense._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl">
                        {expense.icon || '📦'}
                      </div>
                      <div>
                        <p className="font-semibold">{expense.category}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-red-600 font-bold text-lg">- ₹{expense.amount.toLocaleString()}</p>
                      {hoveredId === expense._id && (
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add Expense</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-6">
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pick Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {expenseIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Shopping, Travel, etc"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes about this expense"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Expense;
