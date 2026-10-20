import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, User, LogOut } from 'lucide-react';
import LearnovaLogo from '../../shared/components/LearnovaLogo';
import { useAuth } from '../../shared/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-accent-500' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-navy-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <LearnovaLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/courses" className={navLinkClasses}>
              Courses
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/student/dashboard" className={navLinkClasses}>
                Student Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/student/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white bg-navy-900 border border-navy-750 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-accent-500 text-navy-950 text-xs font-bold flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span>{user?.name || 'Dashboard'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs font-medium text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-navy-900 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-navy-800/50"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-navy-950 bg-accent-500 hover:bg-accent-600 transition-colors px-4 py-2 rounded-xl shadow-sm hover:shadow-accent-500/20 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 bg-navy-850 hover:bg-navy-800 border border-navy-700 text-gray-200 hover:text-white font-medium text-sm px-3.5 py-2 rounded-xl transition-all duration-200 ml-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 text-accent-400" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-700 bg-navy-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-navy-800 hover:text-accent-400"
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-navy-800 hover:text-accent-400"
            >
              Course Catalog
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-accent-400 hover:bg-navy-800"
              >
                Student Dashboard
              </NavLink>
            )}
          </nav>

          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-navy-950/80">
                <div className="text-xs">
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-medium text-gray-200 hover:text-white rounded-lg bg-navy-800/60"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-navy-950 bg-accent-500 rounded-lg hover:bg-accent-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
