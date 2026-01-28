import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LayoutGrid, Wallet, Receipt, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Income', path: '/income', icon: Wallet },
    { name: 'Expense', path: '/expense', icon: Receipt },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`w-64 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold">Expense Tracker</h1>
          <button onClick={onClose} className="md:hidden text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 flex flex-col items-center border-b">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mb-3">
            {user?.profileImage || '👤'}
          </div>
          <h3 className="font-semibold text-gray-800">{user?.name || 'User'}</h3>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
