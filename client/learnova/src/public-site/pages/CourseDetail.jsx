import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  PlayCircle,
  FileText,
  ExternalLink,
  Lock,
  Layers,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import courses from '../data/courses';

export default function CourseDetail() {
  const { id } = useParams();

  // Find course from local dataset
  const course = courses.find((c) => c.id === id);

  // Fallback if course not found
  if (!course) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="rounded-2xl border border-navy-800 bg-navy-900/60 p-12 shadow-xl">
          <BookOpen className="w-12 h-12 text-accent-500 mx-auto mb-4 opacity-80" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Course Not Found
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            The course you are looking for does not exist or may have been moved.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold text-sm transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const isPlaylist = course.resources.videoType === 'playlist';
  const watchButtonLabel = isPlaylist ? 'Watch Course Playlist' : 'Watch Single Video';
  const watchBadge = isPlaylist ? 'Full Playlist' : 'Complete Video';

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* Navigation breadcrumb back to catalog */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent-400 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Course Catalog</span>
      </Link>

      {/* ========================================================================= */}
      {/* COURSE HEADER SECTION */}
      {/* ========================================================================= */}
      <header className="rounded-3xl bg-navy-800/80 border border-navy-700/70 p-6 sm:p-10 shadow-xl shadow-navy-950/40 mb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex-1">
            {/* Meta Tags: Category, Difficulty, Icon, Star Rating */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
              {/* Tech Icon / Label */}
              {course.icon && (
                <span className="px-3 py-1 rounded-lg bg-navy-950 border border-navy-700 text-xs font-bold text-accent-400 tracking-wide uppercase">
                  {course.icon}
                </span>
              )}

              {/* Category Tag */}
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-navy-900 border border-navy-700/80 text-gray-300">
                {course.category}
              </span>

              {/* Difficulty Badge */}
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full border ${
                  course.difficulty === 'Beginner'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                }`}
              >
                {course.difficulty}
              </span>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-xs text-amber-400 ml-auto sm:ml-0 bg-navy-900/80 border border-navy-700/60 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-200">
                  {course.rating.toFixed(1)}
                </span>
                <span className="text-gray-400 text-[11px]">/ 5.0</span>
              </div>
            </div>

            {/* Course Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-5">
              {course.title}
            </h1>

            {/* Editorial Long Description */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {course.longDescription}
            </p>
          </div>

          {/* Course Thumbnail Image (if available) */}
          {course.image && (
            <div className="w-full lg:w-72 aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-navy-700/70 bg-navy-950/90 flex-shrink-0 shadow-lg relative group p-3 flex items-center justify-center">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
              />
            </div>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* LEARNING RESOURCES SECTION */}
      {/* ========================================================================= */}
      <section className="mb-14">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-1.5 block">
            Direct Curriculum Access
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Learning Resources
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Access free primary video lectures and verified study materials for this course.
          </p>
        </div>

        {/* 2 Clear Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Watch Course */}
          <a
            href={course.resources.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl bg-navy-800/80 border border-navy-700/70 hover:border-accent-500/60 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-navy-950/50 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                  <PlayCircle className="w-6 h-6 text-accent-500" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-navy-900 border border-navy-700 text-gray-300">
                  {watchBadge}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-accent-400 transition-colors mb-2">
                Watch Course
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Stream the complete video tutorial directly on YouTube. Prepared for immediate practical application.
              </p>
            </div>

            <div className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-navy-900 border border-navy-700 group-hover:border-accent-500 group-hover:bg-accent-500 text-gray-200 group-hover:text-navy-950 font-semibold text-xs sm:text-sm transition-all duration-200">
              <span>{watchButtonLabel}</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </div>
          </a>

          {/* Card 2: Course Notes */}
          <a
            href={course.resources.notesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl bg-navy-800/80 border border-navy-700/70 hover:border-accent-500/60 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-navy-950/50 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-accent-500" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-navy-900 border border-navy-700 text-gray-300">
                  Documentation & Notes
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-accent-400 transition-colors mb-2">
                Course Notes
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Inspect structured lecture notes, blueprints, and official references to reinforce concept retention.
              </p>
            </div>

            <div className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-navy-900 border border-navy-700 group-hover:border-accent-500 group-hover:bg-accent-500 text-gray-200 group-hover:text-navy-950 font-semibold text-xs sm:text-sm transition-all duration-200">
              <span>Open Course Notes</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </div>
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LOCKED SECTION: Full Course Experience */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl bg-navy-800/40 border border-navy-700/60 p-6 sm:p-10 overflow-hidden shadow-xl backdrop-blur-sm">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900/90 border border-navy-700 text-xs text-accent-400 font-medium mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Student Account Feature</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
              Full Course Experience
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Enroll and track your progress, lesson-by-lesson, once you create a student account.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            {/* Consistent disabled enroll button pattern */}
            <button
              disabled
              className="w-full sm:w-auto cursor-not-allowed opacity-60 bg-navy-900 border border-navy-700 text-gray-400 font-semibold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2.5 text-sm shadow-inner transition-colors"
            >
              <Lock className="w-4 h-4 text-gray-400" />
              <span>Sign Up to Enroll</span>
            </button>
            <span className="text-[11px] text-gray-400 italic">
              Enrollment opens with upcoming student portal
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
