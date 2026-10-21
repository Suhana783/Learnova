import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileUp,
  LogOut,
  Globe,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import LearnovaLogo from '../../shared/components/LearnovaLogo';

export default function StudentSidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      to: '/student/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/student/profile',
      label: 'My Profile',
      icon: User,
    },
    {
      to: '/student/assignments',
      label: 'Assignments',
      icon: FileUp,
    },
  ];

  return (
    <aside className="w-64 bg-navy-950 border-r border-navy-750/70 flex flex-col h-full select-none">
      {/* Brand & Logo */}
      <div className="p-5 border-b border-navy-850 flex items-center justify-between">
        <div onClick={onCloseMobile} className="inline-block">
          <LearnovaLogo size="md" />
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Student Portal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-500 text-navy-950 font-semibold shadow-md shadow-accent-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-navy-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Navigation
        </div>

        <Link
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-navy-900 transition-colors"
        >
          <Globe className="w-4 h-4 text-gray-400" />
          <span>Public Website</span>
        </Link>
        <Link
          to="/courses"
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-navy-900 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-accent-400" />
          <span>Browse Courses</span>
        </Link>
      </div>

      {/* Bottom: Student Profile Card & Logout */}
      <div className="p-3 border-t border-navy-850 bg-navy-900/60">
        <div className="p-2.5 rounded-xl bg-navy-950/80 border border-navy-800/80 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-500/20 text-accent-400 font-bold flex items-center justify-center text-sm border border-accent-500/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Student'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email || 'student@learnova.com'}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified Student</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-300 hover:text-red-400 rounded-lg hover:bg-navy-900/80 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
