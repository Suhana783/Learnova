import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Edit3,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Calendar,
} from 'lucide-react';

export default function Profile() {
  const { user, updateCurrentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable fields
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    interestedIn: user?.interestedIn || '',
  });

  // Fetch latest profile from backend on mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      setFetching(true);
      try {
        const res = await getUserProfile();
        if (res.data) {
          updateCurrentUser(res.data);
          setFormData({
            name: res.data.name || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            interestedIn: res.data.interestedIn || '',
          });
        }
      } catch (err) {
        // Fallback to locally stored user object
        console.warn('Could not fetch server profile, using stored session:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchLatestProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await updateUserProfile(formData);
      if (res.data) {
        updateCurrentUser(res.data);
      } else {
        updateCurrentUser(formData);
      }
      setSuccess('Profile details updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to update profile details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      interestedIn: user?.interestedIn || '',
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-navy-950/80 border border-navy-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-600 to-accent-400 text-navy-950 font-bold text-2xl flex items-center justify-center shadow-lg shadow-accent-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {user?.name || 'Student Name'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-accent-400 hover:text-accent-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-navy-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Details Form / Display */}
        <div className="pt-6">
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-200 bg-navy-900/60 p-3 rounded-xl border border-navy-800">
                  <User className="w-4 h-4 text-accent-500 shrink-0" />
                  <span>{user?.name || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Email Address (Always read-only since verified by OTP) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <span className="text-[11px] text-emerald-400 font-medium">OTP Verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-200 bg-navy-900/60 p-3 rounded-xl border border-navy-800">
                <Mail className="w-4 h-4 text-accent-500 shrink-0" />
                <span>{user?.email || 'Not provided'}</span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-200 bg-navy-900/60 p-3 rounded-xl border border-navy-800">
                  <Phone className="w-4 h-4 text-accent-500 shrink-0" />
                  <span>{user?.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Address
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-200 bg-navy-900/60 p-3 rounded-xl border border-navy-800">
                  <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                  <span>{user?.address || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Area of Interest (Optional) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Interested In (Specialization Track)
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <select
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500"
                  >
                    <option value="">None selected</option>
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="React & Frontend Engineering">React & Frontend Engineering</option>
                    <option value="Node.js & Backend Systems">Node.js & Backend Systems</option>
                    <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                    <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                    <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-200 bg-navy-900/60 p-3 rounded-xl border border-navy-800">
                  <Sparkles className="w-4 h-4 text-accent-500 shrink-0" />
                  <span>{user?.interestedIn || 'Not specified'}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
