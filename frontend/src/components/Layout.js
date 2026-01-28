import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 w-full">
        {/* Mobile Header with Hamburger Menu */}
        <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold text-gray-800">Expense Tracker</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
        
        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
