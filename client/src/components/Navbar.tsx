import React, { useState } from 'react';
import { Home, Briefcase, Sparkles, Building2, ChevronDown, Search, Cpu, LogOut, User, FileText, UploadCloud, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo Brand (Left) */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 font-outfit tracking-tight">Recruitment</span>
              <span className="text-xl font-extrabold text-purple-600 font-outfit">X</span>
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">AI Career Platform</p>
            </div>
          </div>

          {/* Navigation Pill Menu (Center) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Jobs
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              AI Interview
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Resume
            </button>

            <button
              onClick={() => setActiveTab('jd-analyzer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'jd-analyzer'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              JD Analyzer
            </button>

            <button
              onClick={() => setActiveTab('ats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'ats'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              ATS Scorer
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'builder'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Builder
            </button>

            {user?.role === 'RECRUITER' && (
              <button
                onClick={() => setActiveTab('recruiter')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'recruiter'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-700 hover:bg-purple-100'
                }`}
              >
                Recruiter Portal
              </button>
            )}
          </nav>

          {/* Right Controls: Search Bar & Login Button */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-48 xl:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full bg-slate-100 border border-slate-200 pl-9 pr-4 py-1.5 rounded-full text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <img
                    src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full bg-purple-200"
                  />
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">{user.fullName}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs transition-all shadow-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal Component */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
