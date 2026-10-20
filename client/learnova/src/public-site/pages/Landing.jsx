import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import heroBanner from '../../assets/Gemini_Generated_Image_dqddhndqddhndqdd.png';
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
          setError(err.message || 'Failed to load courses');
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
      {/* HERO BANNER SECTION (Preserved exactly as is) */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-navy-950">
        <div className="relative w-full">
          <img
            src={heroBanner}
            alt="Master Complex Skills the Learnova Way"
            className="w-full h-auto block"
          />

          {/* Clickable interactive hotspots for the buttons */}
          <Link
            to="/courses"
            aria-label="Browse Courses"
            className="absolute top-[54.5%] left-[37.2%] w-[14.2%] h-[7.2%] rounded-xl cursor-pointer transition-all hover:ring-2 hover:ring-accent-400/60 focus:outline-none focus:ring-2 focus:ring-accent-400"
            title="Browse Courses"
          />
          <Link
            to="/signup"
            aria-label="Get Started"
            className="absolute top-[54.5%] left-[52.4%] w-[10.6%] h-[7.2%] rounded-xl cursor-pointer transition-all hover:ring-2 hover:ring-accent-400/60 focus:outline-none focus:ring-2 focus:ring-accent-400"
            title="Get Started"
          />
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
            <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700/90 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-navy-950/40 md:col-span-2 relative overflow-hidden group">
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
      <section className="relative w-full py-24 sm:py-32 overflow-hidden border-t border-navy-800/80 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
        {/* Soft abstract ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-accent-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-5 leading-tight">
            Ready to Go Deeper?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Join thousands of learners taking their skills seriously.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-white font-semibold text-base transition-all duration-200 active:scale-[0.98]"
            >
              <span>Browse Courses</span>
              <ArrowRight className="w-4 h-4 text-accent-400" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold text-base transition-all duration-200 shadow-xl shadow-accent-500/25 active:scale-[0.98]"
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



