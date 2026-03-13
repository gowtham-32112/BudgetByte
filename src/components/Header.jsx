import React from 'react';
import CurrencyToggle from './CurrencyToggle';
import { Wallet, LogOut, User as UserIcon, LayoutDashboard, ListOrdered } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center custom-shadow">
            <Wallet className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              BudgetByte
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Student Finance</p>
          </div>
        </div>

        {/* Navigation & Actions */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-indigo-400' : 'text-white/60 hover:text-white'}`}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-indigo-400' : 'text-white/60 hover:text-white'}`}>
              <ListOrdered size={16} /> Transactions
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-indigo-400' : 'text-white/60 hover:text-white'}`}>
              <UserIcon size={16} /> Profile
            </NavLink>
          </div>
        )}

        <div className="flex items-center gap-4">
          <CurrencyToggle />

          {currentUser && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-red-400 transition-colors bg-white/5 px-3 py-2 rounded-lg"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
