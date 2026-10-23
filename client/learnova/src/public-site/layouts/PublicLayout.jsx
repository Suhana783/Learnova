import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * PublicLayout
 * Shared page shell wrapping all public routes (Landing, Course Catalog, Course Detail)
 * with the sticky dark Navbar, dynamic page outlet, and Footer.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-gray-100 font-body selection:bg-accent-500/30 selection:text-white">
      {/* Shared Navigation Header */}
      <Navbar />

      {/* Dynamic Route Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
