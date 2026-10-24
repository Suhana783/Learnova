import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { getAssignments } from '../../services/assignmentService';
import { getAllProgress, enrollInCourse, getContinueLearning } from '../../services/progressService';
import { getCourses } from '../../services/courseServices';
import {
  Sparkles,
  FileUp,
  User,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Trophy,
  PlayCircle,
  Loader2,
  AlertCircle,
  FileText,
  StickyNote,
  Copy,
  Check,
  Search,
  Download,
  Trash2,
  Bookmark,
  Compass,
} from 'lucide-react';

function CourseProgressCard({ course, progress, onEnroll, enrolling }) {
  const navigate = useNavigate();
  const hasProgress = !!progress;
  const percent = progress?.percentComplete ?? 0;
  const completed = progress?.completedLessons ?? 0;
  const total = progress?.totalLessons ?? 0;
  const isFinished = progress?.isCourseCompleted ?? false;
  const thumbnail = course.thumbnail?.url || course.image;
  const notesResource = course.resources?.find((r) => r.type === 'notes') || course.resources?.[0];

  const handleContinue = async () => {
    if (!hasProgress) return;
    try {
      await getContinueLearning(course._id);
      navigate(`/student/learn/${course._id}`);
    } catch {
      navigate(`/student/learn/${course._id}`);
    }
  };

  return (
    <div className="group rounded-2xl bg-gradient-to-b from-navy-900/90 to-navy-950/90 border border-navy-700/80 hover:border-accent-500/40 shadow-lg hover:shadow-xl hover:shadow-accent-500/5 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">

      <div className="relative w-full h-40 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center overflow-hidden border-b border-navy-800/80">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={course.title}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-navy-800/80 border border-navy-700 flex items-center justify-center text-accent-400">
            <BookOpen className="w-7 h-7" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-navy-900/90 backdrop-blur-md border border-navy-700 text-gray-300 text-[10px] font-semibold tracking-wide uppercase">
            {course.level || 'Beginner'}
          </span>
        </div>

        {isFinished ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-semibold backdrop-blur-md shadow-sm">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Completed</span>
          </div>
        ) : hasProgress ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-[10px] font-semibold backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            <span>In Progress</span>
          </div>
        ) : null}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-medium text-accent-400/90 bg-accent-500/10 px-2 py-0.5 rounded-md">
            {course.category || 'Development'}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-accent-300 transition-colors">
          {course.title}
        </h3>

        {hasProgress ? (
          <div className="mt-auto pt-3">

            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>{completed} / {total} lessons completed</span>
              <span className="font-bold text-accent-400">{percent}%</span>
            </div>
            <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden mb-4 border border-navy-800">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleContinue}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 text-xs font-bold transition-all shadow-md hover:shadow-accent-500/20 active:scale-[0.99] cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{isFinished ? 'Review Course' : 'Continue Learning'}</span>
              </button>

              {notesResource?.url && (
                <a
                  href={notesResource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-navy-800/90 hover:bg-navy-700 border border-navy-700 text-gray-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
                  title={`Open notes for ${course.title}`}
                >
                  <FileText className="w-3.5 h-3.5 text-accent-400" />
                  <span className="hidden sm:inline">Notes</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-4 flex items-center gap-2">
            <button
              onClick={() => onEnroll(course._id)}
              disabled={enrolling === course._id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-navy-600 text-xs font-semibold text-white transition-all disabled:opacity-60 cursor-pointer"
            >
              {enrolling === course._id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-accent-400" />
                  <span>Start Course</span>
                </>
              )}
            </button>

            {notesResource?.url && (
              <a
                href={notesResource.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-750 text-gray-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
                title={`Open notes for ${course.title}`}
              >
                <FileText className="w-3.5 h-3.5 text-accent-400" />
                <span className="hidden sm:inline">Notes</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [enrolling, setEnrolling] = useState(null);

  const [notesTab, setNotesTab] = useState('official');
  const [notesSearch, setNotesSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(null);

  const scratchpadKey = `learnova_notes_${user?.email || 'default'}`;
  const [personalNotes, setPersonalNotes] = useState(() => {
    try {
      return localStorage.getItem(scratchpadKey) || '';
    } catch {
      return '';
    }
  });
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  const profileFields = [user?.name, user?.email, user?.phone, user?.address, user?.interestedIn];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?.email) {
          const res = await getAssignments();
          setAssignments(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load assignments:', err);
      } finally {
        setLoadingAssignments(false);
      }
    };
    fetch();
  }, [user?.email]);

  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      try {
        setLoadingCourses(true);
        setCoursesError(null);

        const [coursesResult, progressResult] = await Promise.allSettled([
          getCourses({ limit: 20 }),
          getAllProgress(),
        ]);

        if (coursesResult.status === 'fulfilled') {
          const allCourses = coursesResult.value.data?.data || [];
          setCourses(allCourses);
        } else {
          console.error('Failed to load courses:', coursesResult.reason);
          setCoursesError('Failed to load courses. Please refresh.');
        }

        if (progressResult.status === 'fulfilled') {
          const allProgress = progressResult.value.data?.data || [];
          const map = {};
          for (const p of allProgress) {
            if (p.courseId) {
              map[p.courseId.toString()] = p;
            }
          }
          setProgressMap(map);
        } else {
          console.warn('Could not load course progress (user might need re-auth):', progressResult.reason);
        }
      } catch (err) {
        console.error('Failed to load courses/progress:', err);
        setCoursesError('Failed to load courses. Please refresh.');
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCoursesAndProgress();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      await enrollInCourse(courseId);
      navigate(`/student/learn/${courseId}`);
    } catch (err) {
      console.error('Enrollment failed:', err);
    } finally {
      setEnrolling(null);
    }
  };

  const handleSavePersonalNotes = (val) => {
    setPersonalNotes(val);
    try {
      localStorage.setItem(scratchpadKey, val);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2000);
    } catch (e) {
      console.error('Failed to save personal notes:', e);
    }
  };

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleDownloadScratchpad = () => {
    const element = document.createElement('a');
    const file = new Blob([personalNotes || 'No notes written yet.'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Learnova_Study_Notes_${user?.name?.replace(/\s+/g, '_') || 'Student'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const startedCourses = courses.filter((c) => progressMap[c._id?.toString()]);
  const notStartedCourses = courses.filter((c) => !progressMap[c._id?.toString()]);

  const allCourseNotes = useMemo(() => {
    return courses
      .filter((c) => Array.isArray(c.resources) && c.resources.length > 0)
      .flatMap((c) =>
        c.resources.map((res) => ({
          ...res,
          courseId: c._id,
          courseTitle: c.title,
          courseSlug: c.slug,
          courseCategory: c.category,
          courseLevel: c.level,
        }))
      );
  }, [courses]);

  const filteredNotes = useMemo(() => {
    if (!notesSearch.trim()) return allCourseNotes;
    const q = notesSearch.toLowerCase();
    return allCourseNotes.filter(
      (n) =>
        n.title?.toLowerCase().includes(q) ||
        n.courseTitle?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.courseCategory?.toLowerCase().includes(q)
    );
  }, [allCourseNotes, notesSearch]);

  return (
    <div className="space-y-8 pb-10">

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 border border-navy-700/80 p-6 sm:p-8 shadow-2xl">

        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h2>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">
            {user?.interestedIn
              ? `Your chosen focus area is ${user.interestedIn}. Access lecture notes, assignments, and resume where you left off.`
              : 'Access your course materials, track your progress, review notes, and continue learning.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/student/assignments"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-accent-500/25 transition-all active:scale-[0.98]"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload Assignment</span>
            </Link>

            <a
              href="#course-notes"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              <StickyNote className="w-4 h-4 text-accent-400" />
              <span>Course Notes ({allCourseNotes.length})</span>
            </a>

            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-navy-750 text-gray-300 hover:text-white text-xs sm:text-sm transition-all"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-900/90 to-navy-950/90 border border-navy-750/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Assignments
            </span>
            <div className="w-9 h-9 rounded-xl bg-accent-500/15 text-accent-400 flex items-center justify-center border border-accent-500/20">
              <FileUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-display">
            {assignments.length}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {assignments.length === 1 ? '1 file uploaded' : `${assignments.length} files uploaded`}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-900/90 to-navy-950/90 border border-navy-750/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-display">
            {startedCourses.length}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {courses.filter((c) => progressMap[c._id]?.isCourseCompleted).length} courses completed
          </p>
        </div>

        <a
          href="#course-notes"
          className="p-5 rounded-2xl bg-gradient-to-br from-navy-900/90 to-navy-950/90 border border-navy-750/80 hover:border-emerald-500/40 shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              Study Notes
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <StickyNote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-display group-hover:text-emerald-300 transition-colors">
            {allCourseNotes.length}
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span>Lecture notes & packs</span>
            <ArrowRight className="w-3 h-3 text-emerald-400 inline" />
          </p>
        </a>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-900/90 to-navy-950/90 border border-navy-750/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Profile
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-display">
            {profileCompletion}%
          </div>
          <div className="w-full bg-navy-950 rounded-full h-1.5 mt-2 overflow-hidden border border-navy-800">
            <div
              className="bg-accent-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-navy-950/70 border border-navy-750/80 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">My Courses</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Track your learning progress and enroll in new modules</p>
          </div>
          <Link
            to="/courses"
            className="text-xs text-accent-400 hover:text-accent-300 font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-750 self-start sm:self-auto hover:border-accent-500/30 transition-all"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingCourses ? (
          <div className="py-14 flex flex-col items-center justify-center gap-3 text-gray-400 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-accent-500" />
            <span>Loading courses from catalog...</span>
          </div>
        ) : coursesError ? (
          <div className="py-10 flex flex-col items-center gap-2 text-center bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
            <AlertCircle className="w-7 h-7 text-red-400" />
            <p className="text-sm font-semibold text-red-400">{coursesError}</p>
          </div>
        ) : (
          <div className="space-y-7">

            {startedCourses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                    In Progress ({startedCourses.length})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {startedCourses.map((course) => (
                    <CourseProgressCard
                      key={course._id}
                      course={course}
                      progress={progressMap[course._id?.toString()]}
                      onEnroll={handleEnroll}
                      enrolling={enrolling}
                    />
                  ))}
                </div>
              </div>
            )}

            {notStartedCourses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                    {startedCourses.length === 0 ? 'All Courses' : 'Available to Start'} ({notStartedCourses.length})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {notStartedCourses.map((course) => (
                    <CourseProgressCard
                      key={course._id}
                      course={course}
                      progress={null}
                      onEnroll={handleEnroll}
                      enrolling={enrolling}
                    />
                  ))}
                </div>
              </div>
            )}

            {courses.length === 0 && (
              <div className="py-12 px-4 text-center border border-dashed border-navy-800 rounded-2xl bg-navy-900/30">
                <BookOpen className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-300">No courses currently available</p>
                <p className="text-xs text-gray-500 mt-1">Please check back soon.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div id="course-notes" className="rounded-3xl bg-navy-950/70 border border-navy-750/80 p-6 sm:p-7 shadow-xl scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-500/15 text-accent-400 flex items-center justify-center border border-accent-500/25">
                <StickyNote className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Course Notes & Study Materials
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Curated lecture notes, Google Drive packs, and your private study scratchpad
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-navy-900 border border-navy-750 text-xs">
            <button
              onClick={() => setNotesTab('official')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                notesTab === 'official'
                  ? 'bg-accent-500 text-navy-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Notes ({allCourseNotes.length})</span>
            </button>
            <button
              onClick={() => setNotesTab('scratchpad')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                notesTab === 'scratchpad'
                  ? 'bg-accent-500 text-navy-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>My Scratchpad</span>
              {personalNotes.trim() && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              )}
            </button>
          </div>
        </div>

        {notesTab === 'official' && (
          <div className="space-y-4">

            {allCourseNotes.length > 0 && (
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search notes by course title or topic..."
                  value={notesSearch}
                  onChange={(e) => setNotesSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-navy-900 border border-navy-750 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                />
              </div>
            )}

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id || note.url}
                    className="p-5 rounded-2xl bg-gradient-to-br from-navy-900/90 to-navy-950/80 border border-navy-750/80 hover:border-accent-500/40 shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-500/15 text-accent-400 border border-accent-500/20">
                          {note.type === 'notes' ? 'Google Drive Pack' : 'Documentation'}
                        </span>
                        <span className="text-[11px] text-gray-400 truncate font-medium">
                          {note.courseTitle}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-accent-300 transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent-400 shrink-0" />
                        <span>{note.title}</span>
                      </h4>

                      <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                        {note.description || 'Structured course notes, cheat sheets, and practical revision blueprints.'}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-navy-800 flex items-center justify-between gap-2">
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                      >
                        <span>Open Notes</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(note.url, note._id || note.url)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-navy-700"
                        title="Copy direct link to notes"
                      >
                        {copiedLink === (note._id || note.url) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center border border-dashed border-navy-800 rounded-2xl bg-navy-900/30">
                <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-300">
                  {notesSearch ? 'No notes matched your query' : 'No notes available yet'}
                </p>
                {notesSearch && (
                  <button
                    onClick={() => setNotesSearch('')}
                    className="mt-2 text-xs text-accent-400 hover:underline"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {notesTab === 'scratchpad' && (
          <div className="rounded-2xl bg-navy-900/80 border border-navy-750 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-accent-400" />
                  <span>Personal Study Scratchpad</span>
                </h4>
                <p className="text-xs text-gray-400">
                  Write down code snippets, lecture takeaways, or mentor questions. Automatically saved locally.
                </p>
              </div>

              {noteSavedFeedback && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved locally</span>
                </span>
              )}
            </div>

            <textarea
              rows={7}
              value={personalNotes}
              onChange={(e) => handleSavePersonalNotes(e.target.value)}
              placeholder="Jot down formulas, ideas, key takeaways, and things to review later... (e.g. React useEffect cleanup function, CSS flexbox align-items vs justify-content)"
              className="w-full p-4 bg-navy-950 border border-navy-750 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors font-mono leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 pt-2 border-t border-navy-800">
              <div className="flex items-center gap-3">
                <span>{personalNotes.length} characters</span>
                <span>•</span>
                <span>{personalNotes.trim() ? personalNotes.trim().split(/\s+/).length : 0} words</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadScratchpad}
                  disabled={!personalNotes.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Clear all your scratchpad notes?')) {
                      handleSavePersonalNotes('');
                    }
                  }}
                  disabled={!personalNotes.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-navy-950/70 border border-navy-750/80 p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Submissions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Assignments uploaded to Cloudinary</p>
          </div>
          <Link
            to="/student/assignments"
            className="text-xs text-accent-400 hover:text-accent-300 font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-750 hover:border-accent-500/30 transition-all"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingAssignments ? (
          <div className="py-10 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-accent-500" />
            <span>Loading your submissions...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-navy-800 rounded-2xl bg-navy-900/30">
            <FileUp className="w-10 h-10 text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">No assignments uploaded yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Submit assignments to get written feedback from mentors.
            </p>
            <Link
              to="/student/assignments"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 text-xs font-bold shadow-md transition-all"
            >
              <FileUp className="w-4 h-4" />
              <span>Submit Your First Assignment</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-navy-800/80">
            {assignments.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="py-4 flex items-center justify-between gap-4 first:pt-1 last:pb-1"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate hover:text-accent-300 transition-colors">
                    {item.title || 'Assignment Submission'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="uppercase text-[10px] px-2 py-0.5 rounded-md bg-navy-900 text-gray-300 font-semibold border border-navy-750">
                      {item.fileType?.split('/')[1] || item.fileType || 'PDF'}
                    </span>
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recently'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status || 'Submitted'}
                  </span>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-gray-300 hover:text-white transition-colors border border-navy-750 hover:border-navy-650"
                    title="View on Cloudinary"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
