import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axios';
import { apiPaths } from '../utils/apiPath';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(apiPaths.getDashboard);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { summary, recentTransactions, last30DaysExpenses, expensesByCategory, incomeBySource } = dashboardData || {};

  // Prepare data for charts
  const financialOverviewData = [
    { name: 'Balance', value: summary?.totalBalance || 0, color: '#6B46C1' },
    { name: 'Expenses', value: summary?.totalExpenses || 0, color: '#EF4444' },
    { name: 'Income', value: summary?.totalIncome || 0, color: '#F97316' },
  ];

  const expensesData = Object.entries(expensesByCategory || {}).map(([name, value]) => ({
    name,
    amount: value
  }));

  const incomeData = Object.entries(incomeBySource || {}).map(([name, value]) => ({
    name,
    amount: value
  }));

  // Group expenses by day for bar chart
  const expensesByDay = {};
  (last30DaysExpenses || []).forEach(expense => {
    const day = new Date(expense.date).getDate();
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
    const key = `${day} ${month}`;
    expensesByDay[key] = (expensesByDay[key] || 0) + expense.amount;
  });

  const last30DaysData = Object.entries(expensesByDay).slice(0, 10).map(([date, amount]) => ({
    date,
    amount
  }));

  const COLORS = ['#6B46C1', '#EF4444', '#F97316', '#10B981', '#3B82F6', '#F59E0B'];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <Wallet className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Balance</p>
                <p className="text-2xl font-bold">₹{summary?.totalBalance?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Income</p>
                <p className="text-2xl font-bold">₹{summary?.totalIncome?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-4 rounded-full">
                <TrendingDown className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold">₹{summary?.totalExpenses?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <button className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm font-medium">
                See All <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {(recentTransactions || []).slice(0, 5).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                      {transaction.icon || '📦'}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('en-US', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-red-500 font-semibold">- ₹{transaction.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Overview - Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Financial Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialOverviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {financialOverviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm">Total Balance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Total Expenses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Total Income</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Expenses</h2>
              <button className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm font-medium">
                See All <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {expensesData.slice(0, 4).map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl">
                      {['🛍️', '✈️', '💡', '🏦'][index] || '📦'}
                    </div>
                    <div>
                      <p className="font-medium">{expense.name}</p>
                    </div>
                  </div>
                  <p className="text-red-500 font-semibold">- ₹{expense.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Last 30 Days Expenses - Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Last 30 Days Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last30DaysData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="amount" fill="#6B46C1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last 60 Days Income - Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Last 60 Days Income</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="amount"
                  label={(entry) => entry.name}
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold">₹{summary?.totalIncome?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Income List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Income</h2>
              <button className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm font-medium">
                See All <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {incomeData.slice(0, 5).map((income, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                      {['💼', '🏦', '🛒', '🎨', '📈'][index] || '💰'}
                    </div>
                    <div>
                      <p className="font-medium">{income.name}</p>
                    </div>
                  </div>
                  <p className="text-green-500 font-semibold">+ ₹{income.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
