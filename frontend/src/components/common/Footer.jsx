import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">NexHire</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Connecting qualified professionals with world-class employers. Featuring smart resume validation, bank-grade security, and transparent recruitment pipelines.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Platform</h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li>
                <Link to="/jobs" className="hover:text-indigo-600 transition-colors">
                  Explore Open Jobs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login?tab=signup" className="hover:text-indigo-600 transition-colors">
                  Post a Job Listing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Protection */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Trust & Security</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bank-Grade Account Security</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Verified PDF & Word Resumes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} NexHire Talent Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed for modern career matching
          </p>
        </div>
      </div>
    </footer>
  );
}
