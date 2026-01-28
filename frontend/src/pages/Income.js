import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axios';
import { apiPaths } from '../utils/apiPath';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, X, Download, Trash2 } from 'lucide-react';

const incomeIcons = ['💼', '🏦', '🛒', '🎨', '📈', '💰', '🏢', '💻', '📱', '🎯', '🎁', '💵'];

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: incomeIcons[0]
  });
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axiosInstance.get(apiPaths.getAllIncome);
      setIncomes(response.data.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    
    if (!formData.source || !formData.amount || !formData.date) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axiosInstance.post(apiPaths.addIncome, formData);
      setShowAddModal(false);
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: incomeIcons[0]
      });
      fetchIncomes();
    } catch (error) {
      console.error('Error adding income:', error);
      alert('Failed to add income');
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return;

    try {
      await axiosInstance.delete(apiPaths.deleteIncome(id));
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Failed to delete income');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(apiPaths.downloadIncome, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income-report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Failed to download report');
    }
  };

  // Prepare chart data
  const chartData = incomes.slice(0, 10).map(income => ({
    date: new Date(income.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    amount: income.amount
  })).reverse();

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading income data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Income Overview Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Income Overview</h2>
              <p className="text-gray-500 text-sm">Track your earnings over time and analyze your income trends.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Income
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#6B46C1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Sources */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Income Sources</h2>
            <button
              onClick={handleDownload}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-2 text-sm font-medium"
            >
              <Download size={18} />
              Download
            </button>
          </div>

          {incomes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No income records yet. Add your first income!</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Income
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomes.map((income) => (
                <div
                  key={income._id}
                  className="relative group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  onMouseEnter={() => setHoveredId(income._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                        {income.icon || '💰'}
                      </div>
                      <div>
                        <p className="font-semibold">{income.source}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(income.date).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-green-600 font-bold text-lg">+ ₹{income.amount.toLocaleString()}</p>
                      {hoveredId === income._id && (
                        <button
                          onClick={() => handleDeleteIncome(income._id)}
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

      {/* Add Income Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add Income</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-6">
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pick Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {incomeIcons.map((icon, index) => (
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
                  Income Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Freelance, Salary, etc"
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

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Add Income
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Income;
