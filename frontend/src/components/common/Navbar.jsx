import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Search, PlusCircle, LogOut, User, Menu, X, Shield, ChevronRight } from 'lucide-react';

export default function Navbar({ onOpenPostJob }) {
  const { user, isAuthenticated, logout, isCandidate, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                NexHire
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Career Platform
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/jobs"
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                isActive('/jobs')
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Browse Jobs
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                {isCandidate ? 'My Applications' : 'Recruiter Dashboard'}
              </Link>
            )}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isRecruiter && (
                  <button
                    onClick={onOpenPostJob}
                    className="px-4 py-2 rounded-xl gradient-button text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Job
                  </button>
                )}

                {/* Profile Pill */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-xs font-bold text-slate-800 block max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-600 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?tab=signup"
                  className="px-4 py-2 rounded-xl gradient-button text-white text-xs font-bold shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 text-sm font-semibold"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" /> Browse Jobs
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                {isCandidate ? 'My Applications' : 'Recruiter Dashboard'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          )}

          {isAuthenticated ? (
            <div className="pt-2 space-y-3">
              {isRecruiter && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPostJob();
                  }}
                  className="w-full py-3 rounded-xl gradient-button text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Post New Job
                </button>
              )}
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{user?.name}</span>
                    <span className="text-[10px] text-slate-500">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Exit
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Sign In
              </Link>
              <Link
                to="/login?tab=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl gradient-button text-white font-bold text-xs shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
