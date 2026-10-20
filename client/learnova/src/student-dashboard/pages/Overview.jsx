import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { getAssignments } from '../../services/assignmentService';
import {
  Sparkles,
  FileUp,
  User,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Clock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function Overview() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
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
    fetchStudentData();
  }, [user?.email]);

  // Profile completion calculation based strictly on real fields
  const profileFields = [user?.name, user?.email, user?.phone, user?.address, user?.interestedIn];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

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
              ? `Your chosen focus area is ${user.interestedIn}. Access your course materials, track your progress, and upload assignments below.`
              : 'Access your course materials, track your progress, and upload assignments below.'}
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

      {/* Real Statistics Grid (NO fake data) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Real Submissions Count */}
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
            {assignments.length === 0
              ? 'No submissions yet'
              : `${assignments.length} assignment${assignments.length > 1 ? 's' : ''} uploaded`}
          </p>
        </div>

        {/* Real Profile Completion */}
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

        {/* Account Verification Status */}
        <div className="p-5 rounded-2xl bg-navy-950/70 border border-navy-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Account Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400 font-display flex items-center gap-2">
            Verified Student
          </div>
          <p className="text-xs text-gray-400 mt-1">
            OTP Verified & Active
          </p>
        </div>
      </div>

      {/* Recent Submissions Section (Directly from Real API) */}
      <div className="rounded-2xl bg-navy-950/70 border border-navy-800/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Recent Submissions
            </h3>
            <p className="text-xs text-gray-400">
              Assignments uploaded to Cloudinary
            </p>
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
            <p className="text-sm font-semibold text-gray-300">
              No assignments uploaded yet
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              When you submit assignments, they will appear here with real Cloudinary download links and status.
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
                    title="View uploaded file on Cloudinary"
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
