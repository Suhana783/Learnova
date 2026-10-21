import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import LearnovaLogo from '../../shared/components/LearnovaLogo';

export default function SignUp() {
  const navigate = useNavigate();
  const { sendRegistrationOtp, verifyAndRegister } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    interestedIn: '',
  });

  // Step 1: registration fields, Step 2: OTP verification
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For password, restrict to max 6 digits numeric
    if (name === 'password') {
      const numericVal = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericVal }));
      return;
    }
    // For phone, clean numbers
    if (name === 'phone') {
      const numericPhone = value.replace(/[^\d+ -]/g, '').slice(0, 15);
      setFormData((prev) => ({ ...prev, [name]: numericPhone }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length !== 6) {
      setError('Password must be exactly 6 digits.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter your address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendRegistrationOtp({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        interestedIn: formData.interestedIn.trim(),
        role: 'user',
      });

      setSuccessMsg(res.message || 'OTP sent successfully! Check your email.');
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto advance next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyAndRegister(formData.email.trim().toLowerCase(), fullOtp);
      setSuccessMsg('Account verified successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await sendRegistrationOtp({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        interestedIn: formData.interestedIn.trim(),
        role: 'user',
      });
      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LearnovaLogo size="lg" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            {step === 1 ? 'Create Student Account' : 'Verify Email with OTP'}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {step === 1
              ? 'Join Learnova to learn, submit assignments, and track your progress'
              : `We sent a 6-digit verification code to ${formData.email}`}
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{error}</p>
                {error.toLowerCase().includes('already registered') && (
                  <div className="mt-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-accent-400 hover:text-accent-300 font-semibold underline underline-offset-2 transition-colors"
                    >
                      Log in here &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Step 1: Student Information Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-accent-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-accent-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password (6 Digits) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Password (6 Digits) <span className="text-accent-500">*</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    {formData.password.length}/6 digits
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit numeric password"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 text-sm tracking-widest focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-accent-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 555-0199"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Address <span className="text-accent-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="City, State, Country"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                  />
                </div>
              </div>

              {/* Interested In (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Interested In <span className="text-gray-400 text-[11px] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <select
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors"
                  >
                    <option value="">Select your area of interest</option>
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="React & Frontend Engineering">React & Frontend Engineering</option>
                    <option value="Node.js & Backend Systems">Node.js & Backend Systems</option>
                    <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                    <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                    <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-navy-950 font-semibold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-accent-500/20 active:scale-[0.99] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-500 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-300">
                  Please enter the 6-digit code sent to:
                </p>
                <p className="text-accent-400 font-semibold text-sm mt-0.5">
                  {formData.email}
                </p>
              </div>

              {/* 6 Digit OTP Inputs */}
              <div>
                <label className="block text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  6-Digit OTP Code
                </label>
                <div className="flex justify-center items-center gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-navy-950 font-semibold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-accent-500/20 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Complete Sign Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Actions: Resend or Edit details */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-white transition-colors"
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-accent-400 hover:text-accent-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend OTP</span>
                </button>
              </div>
            </form>
          )}

          {/* Already have an account link */}
          <div className="mt-6 pt-5 border-t border-navy-800/80 text-center text-sm text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="text-accent-400 hover:text-accent-300 font-semibold transition-colors">
              Log In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
