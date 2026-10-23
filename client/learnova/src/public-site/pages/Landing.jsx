import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Clock,
  FileEdit,
  Award,
  Layers,
  Sparkles,
  Quote,
  MessageSquareQuote,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { getCourses } from '../../services/courseServices';

export default function Landing() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await getCourses();
        if (isMounted) {
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          setCourses(list);
        }
      } catch (err) {
        console.error('Failed to load courses on landing:', err);
        if (isMounted) {
          // Preserving the existing error handling logic
          setError('Failed to load courses. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="flex-1 flex flex-col bg-navy-900 text-gray-100">
      {/* ========================================================================= */}
      {/* TEXT-LED HERO */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden border-b border-navy-800/80 bg-navy-950">
        <div className="pointer-events-none absolute -right-28 -top-36 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/25 bg-accent-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-accent-400 sm:text-sm">
              <Sparkles className="h-4 w-4" />
              The New Standard in Intellectual Mastery
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Master complex skills with{' '}
              <span className="text-accent-500">editorial rigor.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Immersive, expert-led courses paired with thoughtful, one-on-one assignment reviews. Learn deeply, practice with purpose, and keep your progress moving.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/courses"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-6 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 active:scale-[0.98] sm:text-base"
              >
                Browse Courses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-navy-700 bg-navy-900/70 px-6 py-3 text-sm font-semibold text-gray-100 transition-colors duration-200 hover:border-accent-500/50 hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 active:scale-[0.98] sm:text-base"
              >
                Get Started <ArrowRight className="h-4 w-4 text-accent-400" />
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-400" />
              Learn at your pace and resume where you left off
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent-500/15 via-transparent to-cyan-400/10 blur-xl" />
            <div className="relative rounded-3xl border border-navy-700/80 bg-gradient-to-br from-navy-800 to-navy-950 p-5 shadow-2xl shadow-black/30 sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">The Learnova approach</span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">Built for deeper learning</h2>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent-500/25 bg-accent-500/10 text-accent-400">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-navy-700/70 bg-navy-950/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Structured curriculum</h3>
                    <p className="mt-1 text-sm leading-5 text-gray-400">Clear modules take you from foundations to practice.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-navy-700/70 bg-navy-950/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Progress that stays with you</h3>
                    <p className="mt-1 text-sm leading-5 text-gray-400">Learn on your schedule and pick up where you stopped.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-navy-700/70 bg-navy-950/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                    <FileEdit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Personal assignment reviews</h3>
                    <p className="mt-1 text-sm leading-5 text-gray-400">Get thoughtful feedback on the work you submit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1 — "How It Works" (3-Step Process) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-3 block">
              The Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
              A Simpler Path to Mastery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative rounded-2xl bg-navy-800/70 border border-navy-700/70 p-8 flex flex-col justify-between hover:border-navy-600 transition-all duration-300 shadow-lg shadow-navy-950/40 group">
              {/* Connector line to next card on desktop */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-navy-700/80 z-20 pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                    <Compass className="w-7 h-7 text-accent-500" />
                  </div>
                  <span className="font-display text-sm font-bold text-accent-500/40">
                    01
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Enroll
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Choose a course led by instructors who've done the work themselves.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl bg-navy-800/70 border border-navy-700/70 p-8 flex flex-col justify-between hover:border-navy-600 transition-all duration-300 shadow-lg shadow-navy-950/40 group">
              {/* Connector line to next card on desktop */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-navy-700/80 z-20 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                    <Clock className="w-7 h-7 text-accent-500" />
                  </div>
                  <span className="font-display text-sm font-bold text-accent-500/40">
                    02
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Learn at Your Pace
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Work through structured lessons on your own schedule, no rigid deadlines.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl bg-navy-800/70 border border-navy-700/70 p-8 flex flex-col justify-between hover:border-navy-600 transition-all duration-300 shadow-lg shadow-navy-950/40 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                    <FileEdit className="w-7 h-7 text-accent-500" />
                  </div>
                  <span className="font-display text-sm font-bold text-accent-500/40">
                    03
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Submit & Get Reviewed
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Every assignment gets real, personal feedback — not just a grade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — Featured Courses Preview */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-t border-navy-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-3 block">
                Explore
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
                Courses Worth Your Time
              </h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                A curated curriculum across core frontend engineering and modern web architecture.
              </p>
            </div>
            <Link
              to="/courses"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors"
            >
              <span>Explore all curriculums</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dynamic Curated Course Cards - Compact preview grid for Home Page */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl bg-navy-800/70 border border-navy-700/60 p-4 animate-pulse flex flex-col justify-between h-96"
                >
                  <div>
                    <div className="w-full h-44 bg-navy-950/80 rounded-xl mb-4" />
                    <div className="h-4 w-24 bg-navy-700/70 rounded-full mb-3" />
                    <div className="h-6 w-3/4 bg-navy-700/80 rounded mb-2" />
                    <div className="h-3.5 w-full bg-navy-700/40 rounded mb-1.5" />
                    <div className="h-3.5 w-2/3 bg-navy-700/40 rounded" />
                  </div>
                  <div className="pt-3 border-t border-navy-700/60">
                    <div className="h-9 w-full bg-navy-700/60 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.slice(0, 4).map((course) => (
                <CourseCard
                  key={course._id || course.id}
                  id={course._id || course.id}
                  title={course.title}
                  category={course.category}
                  description={course.shortDescription || course.description}
                  difficulty={course.level || course.difficulty || 'Beginner'}
                  rating={course.rating?.average > 0 ? course.rating.average : (course.rating || 4.9)}
                  icon={course.tags?.[0] || (course.title?.includes('HTML') ? 'HTML5' : course.title?.includes('CSS') ? 'CSS3' : course.title?.includes('JavaScript') ? 'JS' : course.title?.includes('React') ? 'React' : '')}
                  image={course.thumbnail?.url || course.image}
                  resources={{
                    videoUrl: course.curriculum?.playlistUrl || course.resources?.find((r) => r.type === 'video')?.url,
                    videoType: course.curriculum?.playlistUrl?.includes('list=') ? 'playlist' : 'single',
                    notesUrl: course.resources?.find((r) => r.type === 'notes')?.url || course.resources?.[0]?.url,
                  }}
                  duration={
                    course.duration?.displayLabel ||
                    (course.duration?.value
                      ? `${course.duration.value} ${course.duration.unit}`
                      : course.curriculum?.playlistUrl
                      ? 'Full Playlist'
                      : 'Complete Course')
                  }
                  compact={true}
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-200">
              <p>{error}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-navy-800 bg-navy-900/60 p-8 text-center text-gray-400">
              <p>Courses are being updated. Please check back shortly.</p>
            </div>
          )}

          {/* Centered Button Linking to /courses */}
          <div className="text-center mt-14">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-100 hover:text-white font-medium text-sm border border-navy-700 hover:border-accent-500/40 transition-all duration-200 shadow-md active:scale-[0.98]"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4 text-accent-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — Why Learnova (Value Props Grid) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-t border-navy-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-3 block">
              Why Learnova
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
              Built for Learners Who Want to Go Deep
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Value Prop 1: Real Feedback, Not Just Grades (Featured double width) */}
            <div className="rounded-2xl bg-linear-to-br from-navy-800 to-navy-900 border border-navy-700/90 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-navy-950/40 md:col-span-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-6">
                  <MessageSquareQuote className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  Real Feedback, Not Just Grades
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Every submission is reviewed by a real person with written notes. Detailed critiques address your rationale, syntax, and execution — helping you pinpoint blind spots that automated rubrics miss.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-navy-700/60 flex items-center gap-2 text-xs text-accent-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-accent-500" />
                <span>Line-by-line editorial assignment reviews</span>
              </div>
            </div>

            {/* Value Prop 2: Instructors Who've Done the Work */}
            <div className="rounded-2xl bg-navy-800/60 border border-navy-700/70 p-8 flex flex-col justify-between hover:border-navy-600 transition-colors shadow-lg shadow-navy-950/30">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-6">
                  <Award className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Instructors Who've Done the Work
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Learn from practitioners, not just lecturers. Our instructors bring decades of production-tested expertise from top design studios, newsrooms, and engineering teams.
                </p>
              </div>
            </div>

            {/* Value Prop 3: No Wasted Modules */}
            <div className="rounded-2xl bg-navy-800/40 border border-navy-700/60 p-8 flex flex-col justify-between hover:border-navy-600 transition-colors shadow-lg shadow-navy-950/30">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-6">
                  <Layers className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  No Wasted Modules
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Every lesson earns its place in the curriculum. We strip away superficial filler so every hour you spend builds tangible, compounding mastery.
                </p>
              </div>
            </div>

            {/* Value Prop 4: Rigorous Editorial Standard */}
            <div className="rounded-2xl bg-navy-900 border border-accent-500/20 p-8 flex flex-col justify-between hover:border-accent-500/40 transition-colors shadow-lg shadow-navy-950/30 md:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-6">
                  <Sparkles className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Rigorous Editorial Standard
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                  Expect thoughtful scrutiny. We treat your work with the seriousness it deserves, giving you the high-standard review environment where breakthroughs happen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — Social Proof */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 border-t border-navy-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-3 block">
              Trusted by Serious Learners
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
              Perspectives from the Review Queue
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Quote Card 1 */}
            <div className="rounded-2xl bg-navy-800/60 border border-navy-700/80 p-8 sm:p-10 relative flex flex-col justify-between shadow-lg shadow-navy-950/30">
              <Quote className="w-8 h-8 text-accent-500/40 mb-4" />
              <blockquote className="font-display italic text-lg sm:text-xl text-gray-200 leading-relaxed mb-8">
                "The assignment feedback alone was worth more than most full courses I've taken. Having an experienced practitioner dissect my reasoning line-by-line changed how I write."
              </blockquote>
              <div className="text-sm font-semibold text-accent-400 pt-4 border-t border-navy-700/60">
                — A Learnova Scholar
              </div>
            </div>

            {/* Quote Card 2 */}
            <div className="rounded-2xl bg-navy-800/60 border border-navy-700/80 p-8 sm:p-10 relative flex flex-col justify-between shadow-lg shadow-navy-950/30">
              <Quote className="w-8 h-8 text-accent-500/40 mb-4" />
              <blockquote className="font-display italic text-lg sm:text-xl text-gray-200 leading-relaxed mb-8">
                "There is zero filler here. Every assignment forced me to rethink my fundamental approach to layout and typography. The review turnaround was extraordinarily thorough."
              </blockquote>
              <div className="text-sm font-semibold text-accent-400 pt-4 border-t border-navy-700/60">
                — A Learnova Scholar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — Final CTA Banner */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden border-t border-navy-800/80 bg-linear-to-b from-navy-950 via-navy-900 to-navy-950 py-16 sm:py-24 lg:py-32">
        {/* Soft abstract ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 sm:w-200 h-75 sm:h-100 bg-accent-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="mb-5 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to Go Deeper?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base font-normal leading-relaxed text-gray-300 sm:mb-10 sm:text-lg">
            Join thousands of learners taking their skills seriously.
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              to="/courses"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-orange-700 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-6 py-3.5 text-base font-semibold text-black transition-colors duration-200 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 active:scale-[0.98] sm:w-auto sm:px-8"
            >
              <span>Browse Courses</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-300 via-accent-500 to-orange-600 px-6 py-3.5 text-base font-semibold text-navy-950 shadow-xl shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-orange-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 active:scale-[0.98] sm:w-auto sm:px-8"
            >
              <span>Create Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}



