"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, FileSearch, History, LayoutDashboard, ArrowRight, Layers } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
   <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Jankoti Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Circuit Hexagon Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-[1.5px] shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-transform">
           <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
             <span className="text-xl font-black text-slate-900 tracking-tight">Jan</span>
             <span className="text-xl font-black text-violet-600 tracking-tight">koti</span> 
             <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 border border-violet-200">ATS</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 tracking-wider -mt-1">
              IGNITING FUTURE IDEAS
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
             pathname === "/" ? "text-violet-600 font-semibold" : "text-slate-600 hover:text-violet-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
             pathname.startsWith("/dashboard") ? "text-violet-600 font-semibold" : "text-slate-600 hover:text-violet-600"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/upload"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
            pathname.startsWith("/upload") ? "text-violet-600 font-semibold" : "text-slate-600 hover:text-violet-600"
            }`}
          >
            <FileSearch className="w-4 h-4" />
            Analyze Resume
          </Link>
          <Link
            href="/history"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname.startsWith("/history") ? "text-violet-600 font-semibold" : "text-slate-600 hover:text-violet-600"
            }`}
          >
            <History className="w-4 h-4" />
            History
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
           className="text-sm font-medium text-slate-600 hover:text-violet-600 px-3 py-2 transition-colors hidden sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/upload"
            id="nav-scan-btn"
           className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 px-4 py-2 rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]" 
          >
            <Sparkles className="w-4 h-4" />
            <span>Scan Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
