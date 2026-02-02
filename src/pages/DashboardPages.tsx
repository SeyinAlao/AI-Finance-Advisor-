import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, PlusCircle, Menu, X } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            FinAdvisor
          </h2>
        </div>

        <div className="p-4">
          <button
            onClick={() => navigate('/questionnaire')}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-white bg-green-700 rounded-lg hover:bg-green-800 shadow-md transition-all hover:shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Plan
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <NavLink 
            to="/dashboard/plan" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            My Plan
          </NavLink>

          <NavLink 
            to="/dashboard/history" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <History className="w-5 h-5" />
            History
          </NavLink>

          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <span className="font-bold text-green-700 text-lg">FinAdvisor</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 p-4 absolute top-16 w-full z-10 shadow-lg">
             <button onClick={() => navigate('/questionnaire')} className="w-full text-left py-2 text-green-700 font-bold mb-2">+ New Plan</button>
             <button onClick={() => { navigate('/dashboard/plan'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 text-gray-700">My Plan</button>
             <button onClick={() => { navigate('/dashboard/history'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 text-gray-700">History</button>
             <button onClick={() => { navigate('/dashboard/settings'); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 text-gray-700">Settings</button>
             <button onClick={handleLogout} className="w-full text-left py-2 text-red-600 border-t mt-2 pt-2">Sign Out</button>
          </div>
        )}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;