import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { getAssignments } from '../../services/assignmentService';
import { getAllProgress, enrollInCourse, getContinueLearning } from '../../services/progressService';
import { getCourses } from '../../services/courseServices';
import {
  Sparkles,
  FileUp,
  User,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Trophy,
  PlayCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ─── CourseProgressCard ────────────────────────────────────────────────────────
function CourseProgressCard({ course, progress, onEnroll, enrolling }) {
  const navigate = useNavigate();
  const hasProgress = !!progress;
  const percent = progress?.percentComplete ?? 0;
  const completed = progress?.completedLessons ?? 0;
  const total = progress?.totalLessons ?? 0;
  const isFinished = progress?.isCourseCompleted ?? false;
  const thumbnail = course.thumbnail?.url || course.image;

  const handleContinue = async () => {
    if (!hasProgress) return;
    try {
      const res = await getContinueLearning(course._id);
      const data = res.data?.data;
      navigate(`/student/learn/${course._id}`);
    } catch {
      navigate(`/student/learn/${course._id}`);
    }
  };

  return (
    <div className="rounded-2xl bg-navy-950/70 border border-navy-800/80 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full h-36 bg-navy-900 flex items-center justify-center overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={course.title}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="w-full h-full object-contain p-3"
          />
        ) : (
          <BookOpen className="w-10 h-10 text-navy-700" />
        )}
        {isFinished && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold">
            <Trophy className="w-3 h-3" />
            Completed
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-white leading-snug mb-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{course.category} · {course.level}</p>

        {hasProgress ? (
          <>
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{completed} / {total} lessons</span>
              <span className="font-semibold text-accent-400">{percent}%</span>
            </div>
            <div className="w-full bg-navy-800 rounded-full h-1.5 overflow-hidden mb-4">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <button
              onClick={handleContinue}
              className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 text-xs font-semibold transition-all shadow-sm"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{isFinished ? 'Review Course' : 'Continue Learning'}</span>
            </button>
          </>
        ) : (
          <>
            <div className="flex-1" />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onEnroll(course._id)}
                disabled={enrolling === course._id}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs font-semibold text-gray-200 transition-all disabled:opacity-60"
              >
                {enrolling === course._id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5 text-accent-400" />
                )}
                <span>{enrolling === course._id ? 'Starting...' : 'Start Course'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Overview ─────────────────────────────────────────────────────────────
export default function Overview() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({}); // courseId → progress summary
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [enrolling, setEnrolling] = useState(null); // courseId being enrolled

  // Profile completion
  const profileFields = [user?.name, user?.email, user?.phone, user?.address, user?.interestedIn];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

  // Fetch assignments
  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?.email) {
          const res = await getAssignments({ studentEmail: user.email });
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

  // Fetch courses + progress
  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      try {
        setLoadingCourses(true);
        setCoursesError(null);

        const [coursesRes, progressRes] = await Promise.all([
          getCourses({ limit: 20 }),
          getAllProgress(),
        ]);

        const allCourses = coursesRes.data?.data || [];
        const allProgress = progressRes.data?.data || [];

        setCourses(allCourses);

        // Build a lookup map by courseId
        const map = {};
        for (const p of allProgress) {
          if (p.courseId) {
            map[p.courseId.toString()] = p;
          }
        }
        setProgressMap(map);
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
      // Enroll
      await enrollInCourse(courseId);
      // Refresh progress so the card shows "Continue Learning"
      const progressRes = await getAllProgress();
      const allProgress = progressRes.data?.data || [];
      const map = {};
      for (const p of allProgress) {
        if (p.courseId) map[p.courseId.toString()] = p;
      }
      setProgressMap(map);
    } catch (err) {
      console.error('Enrollment failed:', err);
    } finally {
      setEnrolling(null);
    }
  };

  // Separate courses into: in-progress + not-started
  const startedCourses = courses.filter((c) => progressMap[c._id?.toString()]);
  const notStartedCourses = courses.filter((c) => !progressMap[c._id?.toString()]);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 border border-navy-700/80 p-6 sm:p-8 shadow-xl">
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
              ? `Your chosen focus area is ${user.interestedIn}. Pick up where you left off.`
              : 'Access your course materials, track your progress, and continue learning.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/student/assignments"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload Assignment</span>
            </Link>
            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-650 text-gray-200 text-xs sm:text-sm transition-all"
            >
              <User className="w-4 h-4 text-accent-400" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Assignments Submitted */}
        <div className="p-5 rounded-2xl bg-navy-950/70 border border-navy-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Assignments Submitted
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-500/15 text-accent-400 flex items-center justify-center">
              <FileUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-display">
            {loadingAssignments ? '...' : assignments.length}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {assignments.length === 0 ? 'No submissions yet' : `${assignments.length} uploaded`}
          </p>
        </div>

        {/* Courses In Progress */}
        <div className="p-5 rounded-2xl bg-navy-950/70 border border-navy-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Courses Started
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-display">
            {loadingCourses ? '...' : startedCourses.length}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {startedCourses.filter((c) => progressMap[c._id]?.isCourseCompleted).length} completed
          </p>
        </div>

        {/* Profile Completion */}
        <div className="p-5 rounded-2xl bg-navy-950/70 border border-navy-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Profile Completion
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-display">
            {profileCompletion}%
          </div>
          <div className="w-full bg-navy-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-accent-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── My Courses Section ── */}
      <div className="rounded-2xl bg-navy-950/70 border border-navy-800/80 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">My Courses</h3>
            <p className="text-xs text-gray-400">Track your learning progress</p>
          </div>
          <Link
            to="/courses"
            className="text-xs text-accent-400 hover:text-accent-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Browse All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingCourses ? (
          <div className="py-10 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-accent-500" />
            <span>Loading courses...</span>
          </div>
        ) : coursesError ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <p className="text-sm text-red-400">{coursesError}</p>
          </div>
        ) : (
          <>
            {/* Started / In-progress courses */}
            {startedCourses.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  In Progress
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

            {/* Not-started courses */}
            {notStartedCourses.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  {startedCourses.length === 0 ? 'All Courses' : 'Available Courses'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
              <div className="py-10 px-4 text-center border border-dashed border-navy-800 rounded-xl bg-navy-900/30">
                <BookOpen className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-300">No courses found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Check your backend connection.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent Submissions */}
      <div className="rounded-2xl bg-navy-950/70 border border-navy-800/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Submissions</h3>
            <p className="text-xs text-gray-400">Assignments uploaded to Cloudinary</p>
          </div>
          <Link
            to="/student/assignments"
            className="text-xs text-accent-400 hover:text-accent-300 font-semibold inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingAssignments ? (
          <div className="py-8 text-center text-sm text-gray-400">
            Loading your submissions...
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-10 px-4 text-center border border-dashed border-navy-800 rounded-xl bg-navy-900/30">
            <FileUp className="w-10 h-10 text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">No assignments uploaded yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              When you submit assignments, they will appear here.
            </p>
            <Link
              to="/student/assignments"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-navy-950 text-xs font-semibold"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Submit Your First Assignment</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-navy-800/80">
            {assignments.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {item.title || 'Assignment Submission'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-navy-800 text-gray-300 font-medium">
                      {item.fileType?.split('/')[1] || item.fileType || 'File'}
                    </span>
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : 'Recently'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status || 'Submitted'}
                  </span>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white transition-colors"
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
