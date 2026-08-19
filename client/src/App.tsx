import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ResumeUpload } from './components/ResumeUpload';
import { JdAnalyzer } from './components/JdAnalyzer';
import { AtsScorer } from './components/AtsScorer';
import { ResumeBuilder } from './components/ResumeBuilder';
import { GitHubAudit } from './components/GitHubAudit';
import { JobMatcher } from './components/JobMatcher';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { AiAssistant } from './components/AiAssistant';

function MainContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Module Content */}
      <main className="flex-1 px-4 lg:px-8 pb-12">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'upload' && <ResumeUpload />}
        {activeTab === 'jd-analyzer' && <JdAnalyzer />}
        {activeTab === 'ats' && <AtsScorer />}
        {activeTab === 'builder' && <ResumeBuilder />}
        {activeTab === 'github' && <GitHubAudit />}
        {activeTab === 'jobs' && <JobMatcher />}
        {activeTab === 'ai' && <AiAssistant />}
        {activeTab === 'recruiter' && user?.role === 'RECRUITER' && <RecruiterDashboard />}
        {activeTab === 'recruiter' && user?.role !== 'RECRUITER' && (
          <div className="max-w-xl mx-auto my-16 text-center space-y-4 glass-panel p-8 rounded-3xl border border-rose-500/20">
            <h2 className="text-2xl font-bold text-rose-400 font-outfit">Recruiter Access Restricted</h2>
            <p className="text-sm text-slate-400">
              The Recruiter Talent Portal is restricted to hiring manager accounts. Please sign in with a Recruiter role account to manage job listings and candidate pipelines.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-bold text-white font-outfit">RecruitmentX Platform</span> — Full-Stack AI-Powered ATS & Career Engine
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>React + Vite</span> • <span>Node.js Express</span> • <span>JD Skill Matcher</span> • <span>Prisma PostgreSQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
