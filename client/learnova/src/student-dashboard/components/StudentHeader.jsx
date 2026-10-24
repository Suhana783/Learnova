import { useAuth } from '../../shared/context/AuthContext';
import { Menu, FileUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function StudentHeader({ onToggleMobile }) {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('/profile')) return 'My Profile';
    if (location.pathname.includes('/assignments')) return 'Assignment Submissions';
    if (location.pathname.includes('/learn')) return 'Course Learning';
    return 'Dashboard Overview';
  };

  return (
    <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-md border-b border-navy-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Learnova</span>
            <span>/</span>
            <span className="text-accent-400 font-medium">Student</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-display text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/student/assignments"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-accent-500/15 hover:bg-accent-500/25 border border-accent-500/30 text-accent-400 hover:text-accent-300 text-xs font-semibold transition-colors"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Upload Assignment</span>
        </Link>

        <Link
          to="/student/profile"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-navy-900 border border-navy-750 hover:border-navy-600 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-accent-500 text-navy-950 text-xs font-bold flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <span className="text-xs font-medium text-gray-200 hidden md:inline">
            {user?.name || 'Student'}
          </span>
        </Link>
      </div>
    </header>
  );
}
