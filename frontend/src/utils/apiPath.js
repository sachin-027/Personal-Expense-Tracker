const API_BASE_URL = 'http://localhost:5000/api';

export const apiPaths = {
  // Auth
  signup: `${API_BASE_URL}/auth/signup`,
  login: `${API_BASE_URL}/auth/login`,
  getMe: `${API_BASE_URL}/auth/me`,
  updateProfileImage: `${API_BASE_URL}/auth/profile-image`,
  
  // Income
  addIncome: `${API_BASE_URL}/income`,
  getAllIncome: `${API_BASE_URL}/income`,
  deleteIncome: (id) => `${API_BASE_URL}/income/${id}`,
  downloadIncome: `${API_BASE_URL}/income/download`,
  
  // Expense
  addExpense: `${API_BASE_URL}/expense`,
  getAllExpenses: `${API_BASE_URL}/expense`,
  deleteExpense: (id) => `${API_BASE_URL}/expense/${id}`,
  downloadExpenses: `${API_BASE_URL}/expense/download`,
  
  // Dashboard
  getDashboard: `${API_BASE_URL}/dashboard`,
};
