import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Layers } from 'lucide-react';

export default function CourseCard({
  id = '1',
  title,
  category = 'Frontend Development',
  description,
  rating = 4.9,
  featured = false,
  difficulty,
  icon,
  image,
  resources,
  duration,
  topics,
  compact = false,
}) {
  const courseLink = `/courses/${id}`;
  const actionLabel = 'Explore Course';
  const isPlaylist = resources?.videoType === 'playlist';
  const displayDuration = duration || (isPlaylist ? 'Full Playlist' : 'Single Video');
  const displayRating = typeof rating === 'number' && rating > 0 ? rating.toFixed(1) : '4.9';

  // =========================================================================
  // COMPACT VARIANT (Used on Home Page / Previews)
  // =========================================================================
  if (compact) {
    return (
      <div
        className={`relative flex flex-col justify-between rounded-2xl bg-navy-800/80 border transition-all duration-300 overflow-hidden shadow-lg shadow-navy-950/30 group hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-950/60 ${
          featured ? 'border-accent-500/40 hover:border-accent-500/70' : 'border-navy-700/70 hover:border-accent-500/60'
        }`}
      >
        <div>
          {/* Compact Top Image: Proportional & uncropped */}
          {image && (
            <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-navy-950/95 border-b border-navy-700/60">
              <img
                src={image}
                alt={title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
              />
              {icon && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-navy-950/90 backdrop-blur-md border border-navy-700 text-[11px] font-bold text-accent-400 shadow-sm uppercase tracking-wider">
                  {icon}
                </div>
              )}
            </div>
          )}

          <div className="p-5">
            {/* Header Badges */}
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {difficulty && (
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      difficulty === 'Beginner'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {difficulty}
                  </span>
                )}
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-navy-900 border border-navy-700 text-gray-300">
                  {category}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-amber-400 bg-navy-900 border border-navy-700/70 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-200">
                  {displayRating}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-accent-400 transition-colors mb-2 leading-snug">
              <Link to={courseLink}>{title}</Link>
            </h3>

            {/* Concise Description */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2 mb-3">
              {description}
            </p>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="px-5 pb-5 pt-0">
          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-navy-700/60 pt-3 mb-3">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-accent-500" />
              <span>{difficulty || 'Beginner'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent-500" />
              <span>{displayDuration}</span>
            </div>
          </div>

          <Link
            to={courseLink}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-navy-900 hover:bg-accent-500 text-gray-200 hover:text-navy-950 font-medium text-xs sm:text-sm border border-navy-700 hover:border-accent-500 transition-all duration-200 shadow-sm"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL-SIZE VARIANT (Used on Courses Catalog Page)
  // =========================================================================
  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl bg-navy-800/85 border transition-all duration-300 overflow-hidden shadow-xl shadow-navy-950/40 group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy-950/70 ${
        featured ? 'border-accent-500/50 hover:border-accent-500/80' : 'border-navy-700/70 hover:border-accent-500/60'
      }`}
    >
      <div>
        {/* Top Image: Generous width & height, never cropped */}
        {image && (
          <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden bg-navy-950/95 border-b border-navy-700/60">
            <img
              src={image}
              alt={title}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 drop-shadow-xl"
            />
            {icon && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-navy-950/95 backdrop-blur-md border border-navy-700 text-xs font-bold text-accent-400 shadow-md uppercase tracking-wider">
                {icon}
              </div>
            )}
          </div>
        )}

        {/* Card Body with Rich Content */}
        <div className="p-6 sm:p-8">
          {/* Header Badges: Level Pill, Category, Rating */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {difficulty && (
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    difficulty === 'Beginner'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {difficulty}
                </span>
              )}

              <span className="text-xs font-medium px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-gray-300">
                {category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-navy-900 border border-navy-700/80 px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-200">
                {displayRating}
              </span>
            </div>
          </div>

          {/* Large Editorial Title */}
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-accent-400 transition-colors mb-3 leading-snug">
            <Link to={courseLink}>{title}</Link>
          </h3>

          {/* Rich Description */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-5">
            {description}
          </p>

          {/* Topics / Skills Tags */}
          {topics && topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-2.5 py-1 rounded-lg bg-navy-900/90 border border-navy-700/70 text-gray-300 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata Block + Explore Action Button */}
      <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
        {/* Divider */}
        <div className="border-t border-navy-700/60 my-4" />

        {/* Two-Column Metadata Stats: Level & Duration */}
        <div className="grid grid-cols-2 gap-4 py-1 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-700/80 flex items-center justify-center text-accent-500 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block leading-tight">Level</span>
              <span className="text-sm sm:text-base font-bold text-white">
                {difficulty || 'All Levels'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-700/80 flex items-center justify-center text-accent-500 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block leading-tight">Duration</span>
              <span className="text-sm sm:text-base font-bold text-white">
                {displayDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Pill-shaped Action Button */}
        <Link
          to={courseLink}
          className="inline-flex items-center justify-center gap-2.5 py-3 px-6 rounded-2xl border-2 border-accent-500/80 hover:border-accent-500 text-accent-400 hover:bg-accent-500 hover:text-navy-950 font-bold text-sm sm:text-base transition-all duration-200 shadow-md active:scale-[0.99] w-full sm:w-auto"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
