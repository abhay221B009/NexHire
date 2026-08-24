import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [role, setRole] = useState('candidate'); // 'candidate' | 'recruiter'

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchParams.get('tab') === 'signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (activeTab === 'signup' && !name)) {
      showError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        await signup(name, email, password, role);
        showSuccess(`Account created successfully! Welcome to NexHire.`);
      } else {
        await login(email, password);
        showSuccess('Welcome back!');
      }
      navigate('/dashboard');
    } catch (error) {
      showError(error.customMessage || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-button flex items-center justify-center mx-auto shadow-md">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {activeTab === 'signup' ? 'Create Your NexHire Account' : 'Welcome Back to NexHire'}
          </h1>
          <p className="text-xs text-slate-500">
            Smart Talent & Career Matching Platform
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Toggle for Signup */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    role === 'candidate'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" /> Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    role === 'recruiter'
                      ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Recruiter
                </button>
              </div>
            </div>
          )}

          {/* Full Name */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.chen@nexhire.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-button text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {activeTab === 'signup' ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Account Note */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Quick Account Tip:
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Select <strong>Candidate</strong> to explore open jobs and upload your resume, or <strong>Recruiter</strong> to publish jobs and manage applicants.
          </p>
        </div>
      </div>
    </div>
  );
}
