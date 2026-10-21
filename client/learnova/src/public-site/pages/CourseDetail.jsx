import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  PlayCircle,
  FileText,
  ExternalLink,
  Layers,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { getCourseById } from '../../services/courseServices';
import { useAuth } from '../../shared/context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await getCourseById(id);
      const courseData = res.data?.data || res.data;

      if (!courseData) {
        setError('Course not found');
        setCourse(null);
      } else {
        setCourse(courseData);
      }
    } catch (err) {
      console.error('Failed to fetch course details:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to load course details. Please verify the course ID and backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let active = true;
    const loadCourse = async () => {
      if (!active) return;
      await fetchCourse();
    };

    loadCourse();

    return () => {
      active = false;
    };
  }, [fetchCourse, id]);

  if (loading) {
    return (
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <div className="h-5 w-40 bg-navy-800 rounded animate-pulse mb-8" />
        <div className="rounded-3xl bg-navy-800/80 border border-navy-700/60 p-6 sm:p-10 mb-12 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="flex-1 w-full">
              <div className="flex gap-2 mb-5">
                <div className="h-6 w-20 bg-navy-700 rounded-full" />
                <div className="h-6 w-28 bg-navy-700 rounded-full" />
              </div>
              <div className="h-10 w-3/4 bg-navy-700 rounded-lg mb-5" />
              <div className="h-4 w-full bg-navy-700/60 rounded mb-2" />
              <div className="h-4 w-5/6 bg-navy-700/60 rounded" />
            </div>
            <div className="w-full lg:w-72 h-64 bg-navy-950/80 rounded-2xl shrink-0" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-48 rounded-2xl bg-navy-800/60 border border-navy-700/60 animate-pulse" />
          <div className="h-48 rounded-2xl bg-navy-800/60 border border-navy-700/60 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="rounded-2xl border border-navy-800 bg-navy-900/60 p-12 shadow-xl">
          <BookOpen className="w-12 h-12 text-accent-500 mx-auto mb-4 opacity-80" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Course Not Found
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {error || 'The course you are looking for does not exist or may have been moved.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={fetchCourse}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 border border-navy-700 font-semibold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold text-sm transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPlaylist =
    course.curriculum?.playlistUrl?.includes('list=') ||
    course.curriculum?.playlistUrl?.includes('playlist') ||
    course.resources?.some((r) => r.type === 'video');
  const watchButtonLabel = isPlaylist ? 'Watch Course Playlist' : 'Watch Video Lecture';
  const watchBadge = isPlaylist ? 'Full Playlist' : 'Complete Video';

  const videoUrl =
    course.curriculum?.playlistUrl ||
    course.resources?.find((r) => r.type === 'video')?.url ||
    null;

  const notesResource =
    course.resources?.find((r) => r.type === 'notes') ||
    (course.resources && course.resources.length > 0 ? course.resources[0] : null);

  const additionalResources =
    course.resources && course.resources.length > 1
      ? course.resources.filter((r) => r !== notesResource)
      : [];

  const techIcon =
    course.tags?.[0] ||
    (course.title?.includes('HTML')
      ? 'HTML5'
      : course.title?.includes('CSS')
        ? 'CSS3'
        : course.title?.includes('JavaScript')
          ? 'JS'
          : course.title?.includes('React')
            ? 'React'
            : '');

  const displayRating =
    typeof course.rating?.average === 'number' && course.rating.average > 0
      ? course.rating.average.toFixed(1)
      : '4.9';

  const difficultyLevel = course.level || course.difficulty || 'Beginner';
  const imageUrl = course.thumbnail?.url || course.image;

  const isSignedOut = !isAuthenticated;
  const watchHref = isSignedOut ? '/signup' : (videoUrl || '/signup');
  const notesHref = isSignedOut ? '/signup' : (notesResource?.url || '/signup');
  const watchTarget = isSignedOut ? undefined : '_blank';
  const notesTarget = isSignedOut ? undefined : '_blank';
  const watchRel = isSignedOut ? undefined : 'noopener noreferrer';
  const notesRel = isSignedOut ? undefined : 'noopener noreferrer';

  const handleProtectedLink = (e) => {
    if (isSignedOut) {
      e.preventDefault();
      window.location.href = '/signup';
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent-400 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Course Catalog</span>
      </Link>

      <header className="rounded-3xl bg-navy-800/80 border border-navy-700/70 p-6 sm:p-10 shadow-xl shadow-navy-950/40 mb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-5">
              {techIcon && (
                <span className="px-3 py-1 rounded-lg bg-navy-950 border border-navy-700 text-xs font-bold text-accent-400 tracking-wide uppercase">
                  {techIcon}
                </span>
              )}

              <span className="text-xs font-medium px-3 py-1 rounded-full bg-navy-900 border border-navy-700/80 text-gray-300">
                {course.category}
              </span>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full border ${
                  difficultyLevel === 'Beginner'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                }`}
              >
                {difficultyLevel}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-amber-400 ml-auto sm:ml-0 bg-navy-900/80 border border-navy-700/60 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-200">{displayRating}</span>
                <span className="text-gray-400 text-[11px]">/ 5.0</span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-5">
              {course.title}
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {course.description || course.shortDescription}
            </p>
          </div>

          {imageUrl && (
            <div className="w-full lg:w-72 aspect-square sm:aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden border border-navy-700/70 bg-navy-950/90 shrink-0 shadow-lg relative group p-3 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={course.title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
              />
            </div>
          )}
        </div>
      </header>

      {((course.learningOutcomes && course.learningOutcomes.length > 0) ||
        (course.highlights && course.highlights.length > 0) ||
        (course.prerequisites && course.prerequisites.length > 0)) && (
        <section className="mb-14">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-1.5 block">
              Curriculum Overview
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What You'll Master
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="rounded-2xl bg-navy-800/80 border border-navy-700/70 p-6 sm:p-8 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-500 shrink-0" />
                    <span>Learning Outcomes</span>
                  </h3>
                  <ul className="space-y-3">
                    {course.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {course.highlights && course.highlights.length > 0 && (
                <div className="rounded-2xl bg-navy-800/80 border border-navy-700/70 p-6 sm:p-8 shadow-lg flex-1">
                  <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-accent-500 shrink-0" />
                    <span>Key Highlights</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.highlights.map((highlight, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-gray-200 font-medium">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="rounded-2xl bg-navy-800/60 border border-navy-700/60 p-6 shadow-lg">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                    Prerequisites
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-navy-900/80 border border-navy-700/80 text-gray-300">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {videoUrl ? (
            <a
              href={watchHref}
              target={watchTarget}
              rel={watchRel}
              onClick={handleProtectedLink}
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
                  {isSignedOut
                    ? 'Sign up to unlock the full lesson video and continue learning.'
                    : 'Stream the complete video tutorial directly on YouTube. Prepared for immediate practical application.'}
                </p>
              </div>

              <div className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-navy-900 border border-navy-700 group-hover:border-accent-500 group-hover:bg-accent-500 text-gray-200 group-hover:text-navy-950 font-semibold text-xs sm:text-sm transition-all duration-200">
                <span>{isSignedOut ? 'Sign Up to Watch' : watchButtonLabel}</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </div>
            </a>
          ) : (
            <div className="rounded-2xl bg-navy-800/50 border border-navy-700/50 p-6 flex flex-col justify-between opacity-80">
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 mb-4">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Watch Course</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {isSignedOut
                    ? 'Video access is unlocked after sign-up.'
                    : 'Lectures for this track will be posted shortly.'}
                </p>
              </div>
              <span className="text-xs text-gray-500 font-medium py-2.5 px-4 rounded-xl bg-navy-900/60 border border-navy-800 block text-center">
                {isSignedOut ? 'Sign Up Required' : 'Coming Soon'}
              </span>
            </div>
          )}

          {notesResource?.url ? (
            <a
              href={notesHref}
              target={notesTarget}
              rel={notesRel}
              onClick={handleProtectedLink}
              className="group relative rounded-2xl bg-navy-800/80 border border-navy-700/70 hover:border-accent-500/60 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-navy-950/50 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-accent-500" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-navy-900 border border-navy-700 text-gray-300">
                    {notesResource.title || 'Documentation & Notes'}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-accent-400 transition-colors mb-2">
                  {notesResource.title || 'Course Notes'}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {isSignedOut
                    ? 'Create a student account to unlock course notes and reference material.'
                    : notesResource.description || 'Inspect structured lecture notes, blueprints, and official references to reinforce concept retention.'}
                </p>
              </div>

              <div className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-navy-900 border border-navy-700 group-hover:border-accent-500 group-hover:bg-accent-500 text-gray-200 group-hover:text-navy-950 font-semibold text-xs sm:text-sm transition-all duration-200">
                <span>{isSignedOut ? 'Sign Up to Open' : 'Open Course Notes'}</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </div>
            </a>
          ) : (
            <div className="rounded-2xl bg-navy-800/50 border border-navy-700/50 p-6 flex flex-col justify-between opacity-80">
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Course Notes</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {isSignedOut
                    ? 'Course notes require a student account.'
                    : 'Reference materials and study notes are currently being compiled.'}
                </p>
              </div>
              <span className="text-xs text-gray-500 font-medium py-2.5 px-4 rounded-xl bg-navy-900/60 border border-navy-800 block text-center">
                {isSignedOut ? 'Sign Up Required' : 'Coming Soon'}
              </span>
            </div>
          )}
        </div>
      </section>

      {additionalResources.length > 0 && (
        <section className="pb-10">
          <h3 className="font-display text-xl font-bold text-white mb-4">Additional References</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {additionalResources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl bg-navy-800/80 border border-navy-700/70 px-4 py-3 text-sm text-gray-300 hover:border-accent-500/50 hover:text-white transition-colors"
              >
                <span>{resource.title || 'Reference'}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
