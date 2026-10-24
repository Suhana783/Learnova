import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  BookOpen,
  AlertCircle,
  ExternalLink,
  FileText,
  CheckCheck,
  SkipForward,
  SkipBack,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { getCourseById } from '../../services/courseServices';
import {
  getCourseProgress,
  startLesson,
  completeLesson,
} from '../../services/progressService';

function buildEmbedUrl(videoId) {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

function ModulePanel({
  mod,
  isOpen,
  onToggle,
  lessonProgress,
  currentLessonId,
  onSelectLesson,
  selectingLessonId,
}) {
  const completedCount = mod.lessons.filter((l) =>
    lessonProgress[l._id]?.isCompleted
  ).length;

  return (
    <div className="border border-navy-700/60 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-navy-900/80 hover:bg-navy-800 transition-colors text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{mod.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {completedCount}/{mod.lessons.length} lessons completed
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {completedCount === mod.lessons.length && mod.lessons.length > 0 && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="divide-y divide-navy-800/60">
          {mod.lessons.map((lesson) => {
            const lp = lessonProgress[lesson._id];
            const isActive = lesson._id === currentLessonId;
            const isDone = lp?.isCompleted;
            const isStarted = !!lp;

            return (
              <button
                key={lesson._id}
                onClick={() => onSelectLesson(lesson)}
                disabled={selectingLessonId === lesson._id}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                  isActive
                    ? 'bg-accent-500/10 border-l-2 border-accent-500'
                    : 'hover:bg-navy-800/60 border-l-2 border-transparent'
                } ${selectingLessonId === lesson._id ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : selectingLessonId === lesson._id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-accent-400" />
                  ) : isStarted ? (
                    <PlayCircle className="w-5 h-5 text-accent-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-navy-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-medium leading-snug truncate ${
                      isActive ? 'text-accent-400' : isDone ? 'text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {lesson.order}. {lesson.title}
                  </p>
                  {lesson.durationMinutes > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {lesson.durationMinutes} min
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CourseLearning() {
  const { courseId } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const [summary, setSummary] = useState(null);

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openModules, setOpenModules] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [completingLesson, setCompletingLesson] = useState(false);
  const [completionError, setCompletionError] = useState(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [lessonStartError, setLessonStartError] = useState(null);
  const [selectingLessonId, setSelectingLessonId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, progressRes] = await Promise.all([
        getCourseById(courseId),
        getCourseProgress(courseId),
      ]);

      const courseData = courseRes.data?.data || courseRes.data;
      const progressData = progressRes.data?.data;

      if (!courseData) throw new Error('Course not found');

      setCourse(courseData);
      setSummary(progressData?.summary || null);

      const lp = {};
      if (progressData?.progress?.lessons) {
        for (const l of progressData.progress.lessons) {
          lp[l.lessonId.toString()] = l;
        }
      }
      setLessonProgress(lp);

      const modules = courseData.curriculum?.modules || [];
      if (modules.length > 0) {
        const currentLessonId = progressData?.summary?.currentLessonId;
        let defaultMod = modules[0];
        let defaultLesson = modules[0]?.lessons[0] || null;

        if (currentLessonId) {
          for (const mod of modules) {
            const lesson = mod.lessons.find(
              (l) => l._id.toString() === currentLessonId.toString()
            );
            if (lesson) {
              defaultMod = mod;
              defaultLesson = lesson;
              break;
            }
          }
        }

        setSelectedModule(defaultMod);
        setSelectedLesson(defaultLesson);
        setOpenModules({ [defaultMod._id]: true });
      }
    } catch (err) {
      console.error('Failed to load course learning data:', err);
      setError(
        err.response?.data?.message || err.message || 'Failed to load course.'
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && courseId) {
      const timer = setTimeout(() => {
        void loadData();
      }, 0);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [authLoading, isAuthenticated, courseId, loadData]);

  const handleSelectLesson = useCallback(
    async (mod, lesson) => {
      setJustCompleted(false);
      setCompletionError(null);
      setLessonStartError(null);
      setSelectingLessonId(lesson._id);

      try {
        const res = await startLesson(courseId, lesson._id, mod._id);
        const updatedProgress = res.data?.data;

        setSelectedModule(mod);
        setSelectedLesson(lesson);

        if (updatedProgress?.lessons) {
          const lp = {};
          for (const l of updatedProgress.lessons) {
            lp[l.lessonId.toString()] = l;
          }
          setLessonProgress(lp);
        }
      } catch (err) {
        console.error('Failed to record lesson start:', err);
        setLessonStartError(
          err.response?.data?.message || 'Failed to start this lesson. Please try again.'
        );
      } finally {
        setSelectingLessonId(null);
      }
    },
    [courseId]
  );

  const handleMarkComplete = useCallback(async () => {
    if (!selectedLesson || !selectedModule) return;
    try {
      setCompletingLesson(true);
      setCompletionError(null);

      const res = await completeLesson(courseId, selectedLesson._id, selectedModule._id);
      const responseData = res.data?.data;

      setLessonProgress((prev) => ({
        ...prev,
        [selectedLesson._id.toString()]: {
          ...(prev[selectedLesson._id.toString()] || {}),
          isCompleted: true,
          completedAt: new Date().toISOString(),
        },
      }));

      setSummary((prev) => ({
        ...prev,
        percentComplete: responseData?.percentComplete ?? prev?.percentComplete,
        completedLessons: responseData?.completedLessons ?? prev?.completedLessons,
        isCourseCompleted: responseData?.isCourseCompleted ?? prev?.isCourseCompleted,
      }));

      setJustCompleted(true);
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
      setCompletionError('Failed to save completion. Please try again.');
    } finally {
      setCompletingLesson(false);
    }
  }, [courseId, selectedLesson, selectedModule]);

  const getAllLessonsFlat = useCallback(() => {
    if (!course) return [];
    const sorted = [...(course.curriculum?.modules || [])].sort(
      (a, b) => a.order - b.order
    );
    const flat = [];
    for (const mod of sorted) {
      for (const lesson of [...mod.lessons].sort((a, b) => a.order - b.order)) {
        flat.push({ mod, lesson });
      }
    }
    return flat;
  }, [course]);

  const currentFlatIndex = useCallback(() => {
    if (!selectedLesson) return -1;
    return getAllLessonsFlat().findIndex(
      (item) => item.lesson._id === selectedLesson._id
    );
  }, [selectedLesson, getAllLessonsFlat]);

  const modules = [...(course?.curriculum?.modules || [])].sort(
    (a, b) => a.order - b.order
  );
  const flat = getAllLessonsFlat();
  const flatIdx = currentFlatIndex();
  const hasPrev = flatIdx > 0;
  const hasNext = flatIdx < flat.length - 1;
  const isCurrentLessonCompleted =
    selectedLesson && lessonProgress[selectedLesson._id]?.isCompleted;

  const embedUrl = selectedLesson?.videoId
    ? buildEmbedUrl(selectedLesson.videoId)
    : null;

  const percentComplete = summary?.percentComplete ?? 0;
  const isCourseCompleted = summary?.isCourseCompleted ?? false;

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: `/student/learn/${courseId}` }} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center rounded-2xl border border-navy-700 bg-navy-800/80 p-10">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Course</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const navigateLesson = (dir) => {
    const flatList = getAllLessonsFlat();
    const idx = currentFlatIndex();
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= flatList.length) return;
    const { mod, lesson } = flatList[nextIdx];
    handleSelectLesson(mod, lesson);
    setOpenModules((prev) => ({ ...prev, [mod._id]: true }));
  };

  return (
    <div className="min-h-screen bg-navy-900 text-gray-100 flex flex-col">

      <header className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-md border-b border-navy-800 px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link
          to="/student/dashboard"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group shrink-0"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-white truncate">
            {course.title}
          </h1>
          <p className="text-xs text-gray-400">
            {summary?.completedLessons ?? 0} / {flat.length} lessons completed
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-28 h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-accent-400">
              {percentComplete}%
            </span>
          </div>

          {isCourseCompleted && (
            <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 flex flex-col overflow-y-auto">

          <div className="w-full bg-black aspect-video relative">
            {embedUrl ? (
              <iframe
                key={selectedLesson?._id}
                src={embedUrl}
                title={selectedLesson?.title || 'Lesson Video'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-navy-950 gap-3">
                <PlayCircle className="w-16 h-16 text-navy-700" />
                <p className="text-gray-500 text-sm">
                  {selectedLesson ? 'Video unavailable' : 'Select a lesson to begin'}
                </p>
              </div>
            )}
          </div>

          {selectedLesson && (
            <div className="p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">

              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                {selectedModule?.title}
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {selectedLesson.title}
              </h2>

              {selectedLesson.description && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedLesson.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigateLesson(-1)}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-sm font-medium text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {isCurrentLessonCompleted || justCompleted ? (
                  <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                    <CheckCheck className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={completingLesson}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-navy-950 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md shadow-accent-500/20"
                  >
                    {completingLesson ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{completingLesson ? 'Saving...' : 'Mark as Completed'}</span>
                  </button>
                )}

                <button
                  onClick={() => navigateLesson(1)}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-sm font-medium text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <SkipForward className="w-4 h-4" />
                </button>

                {selectedLesson.videoUrl && (
                  <a
                    href={selectedLesson.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                  </a>
                )}
              </div>

              {completionError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {completionError}
                </p>
              )}

              {lessonStartError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {lessonStartError}
                </p>
              )}

              {course.resources && course.resources.length > 0 && (
                <div className="pt-4 border-t border-navy-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Course Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.resources.map((res) => (
                      <a
                        key={res._id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-accent-500/50 text-xs text-gray-300 hover:text-white transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-accent-400" />
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Lesson Resources
                  </h4>
                  {selectedLesson.resources.map((res) => (
                    <a
                      key={res._id}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {res.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {!selectedLesson && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
              <BookOpen className="w-12 h-12 text-navy-700 mb-4" />
              <p className="text-gray-400 text-sm">
                Select a lesson from the curriculum panel to begin.
              </p>
            </div>
          )}
        </div>

        <aside className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-navy-800 bg-navy-950/60 overflow-y-auto shrink-0">
          <div className="p-4 border-b border-navy-800">
            <h3 className="text-sm font-bold text-white">Course Curriculum</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {flat.length} lessons · {modules.length} modules
            </p>

            <div className="mt-3 w-full bg-navy-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-accent-400 mt-1 font-semibold">
              {percentComplete}% complete
            </p>
          </div>

          {modules.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
              <BookOpen className="w-8 h-8 text-navy-700 mb-2" />
              <p className="text-xs text-gray-400">No curriculum available yet.</p>
            </div>
          ) : (
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {modules.map((mod) => (
                <ModulePanel
                  key={mod._id}
                  mod={mod}
                  isOpen={!!openModules[mod._id]}
                  onToggle={() =>
                    setOpenModules((prev) => ({
                      ...prev,
                      [mod._id]: !prev[mod._id],
                    }))
                  }
                  lessonProgress={lessonProgress}
                  currentLessonId={selectedLesson?._id}
                  onSelectLesson={(lesson) => handleSelectLesson(mod, lesson)}
                  selectingLessonId={selectingLessonId}
                />
              ))}
            </div>
          )}

          {isCourseCompleted && (
            <div className="p-4 border-t border-navy-800 bg-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <Trophy className="w-4 h-4" />
                <span>Course Completed!</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                You've completed all lessons in this course.
              </p>
            </div>
          )}
        </aside>
      </div>

      <MobileCurriculumPanel
        modules={modules}
        flat={flat}
        lessonProgress={lessonProgress}
        selectedLesson={selectedLesson}
        openModules={openModules}
        setOpenModules={setOpenModules}
        onSelectLesson={handleSelectLesson}
        percentComplete={percentComplete}
        selectingLessonId={selectingLessonId}
      />
    </div>
  );
}

function MobileCurriculumPanel({
  modules,
  flat,
  lessonProgress,
  selectedLesson,
  openModules,
  setOpenModules,
  onSelectLesson,
  percentComplete,
  selectingLessonId,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="lg:hidden border-t border-navy-800 bg-navy-950">
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent-400" />
          <span>Curriculum ({flat.length} lessons)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-accent-400 font-bold">{percentComplete}%</span>
          {mobileOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {mobileOpen && (
        <div className="max-h-64 overflow-y-auto border-t border-navy-800 space-y-2 p-3">
          {modules.map((mod) => (
            <ModulePanel
              key={mod._id}
              mod={mod}
              isOpen={!!openModules[mod._id]}
              onToggle={() =>
                setOpenModules((prev) => ({ ...prev, [mod._id]: !prev[mod._id] }))
              }
              lessonProgress={lessonProgress}
              currentLessonId={selectedLesson?._id}
              onSelectLesson={(lesson) => {
                onSelectLesson(mod, lesson);
                setMobileOpen(false);
              }}
              selectingLessonId={selectingLessonId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
