import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import LearnovaLogo from '../../shared/components/LearnovaLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          </nav>

          {/* Right Action Buttons: Log In, Sign In, Explore Courses */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-navy-800/50"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-navy-800/50"
            >
              Sign In
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-navy-950 font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-accent-500/20 active:scale-[0.98] ml-1"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
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
          </nav>

          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-sm font-medium text-gray-200 hover:text-white rounded-lg bg-navy-800/60"
              >
                Log In
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-sm font-medium text-gray-200 hover:text-white rounded-lg bg-navy-800/60"
              >
                Sign In
              </Link>
            </div>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-accent-500 text-navy-950 rounded-lg hover:bg-accent-600 font-semibold"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
