import React, { useState } from 'react';
import { Cpu, X, Mail, Lock, User, Shield, AlertCircle, RefreshCw, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE');

  // Feedback State
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register(email, password, fullName, role);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  const fillDemoCandidate = () => {
    setEmail('candidate@recruitmentx.ai');
    setPassword('Password123!');
    setMode('login');
  };

  const fillDemoRecruiter = () => {
    setEmail('recruiter@recruitmentx.ai');
    setPassword('Password123!');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-3xl border border-indigo-500/30 overflow-hidden shadow-2xl relative">
        {/* Top Glow & Header */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white font-outfit">RecruitmentX Account</h2>
              <p className="text-xs text-slate-400">Sign in or create an account to save resumes & applications</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 mt-5">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex.vance@recruitmentx.ai"
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Authenticating...' : 'Sign In to RecruitmentX'}
              </button>

              {/* Demo Account Quick Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block font-semibold text-center uppercase tracking-wider">Demo Quick Access</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={fillDemoCandidate}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-[11px] font-medium text-indigo-300 flex items-center justify-center gap-1"
                  >
                    <User className="w-3 h-3" /> Candidate Demo
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoRecruiter}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-[11px] font-medium text-purple-300 flex items-center justify-center gap-1"
                  >
                    <Shield className="w-3 h-3" /> Recruiter Demo
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex.vance@recruitmentx.ai"
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium">Password (min 6 chars)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('CANDIDATE')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      role === 'CANDIDATE'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Candidate (Job Seeker)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('RECRUITER')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      role === 'RECRUITER'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Recruiter (Hiring Manager)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
