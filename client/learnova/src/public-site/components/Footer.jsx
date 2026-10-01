import React from 'react';
import { Link } from 'react-router-dom';
import LearnovaLogo from '../../shared/components/LearnovaLogo';

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-gray-400 text-sm mt-auto relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Left Column: Logo + Tagline + Social Icons */}
          <div className="space-y-4 md:col-span-2">
            <LearnovaLogo size="md" />
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Master complex skills through expert-led courses and rigorous, 1-on-1 editorial assignment reviews.
            </p>

            {/* Social Icons Placeholders: Twitter/X, LinkedIn, GitHub */}
            <div className="flex items-center gap-3 pt-2">
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Learnova on X"
                className="w-9 h-9 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-500/50 hover:bg-navy-800 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Learnova on LinkedIn"
                className="w-9 h-9 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-500/50 hover:bg-navy-800 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Learnova on GitHub"
                className="w-9 h-9 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-500/50 hover:bg-navy-800 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Middle Column: Platform Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200">Platform</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/courses" className="hover:text-accent-400 transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-accent-400 transition-colors">
                  Featured Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-accent-400 transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-accent-400 transition-colors">
                  Review Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column: Company Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#about" className="hover:text-accent-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-accent-400 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-accent-400 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Learnova. All rights reserved.</p>
          <p className="text-gray-400 font-medium">
            Built with the MERN stack
          </p>
        </div>
      </div>
    </footer>
  );
}
