import React from 'react';
import { UserCheck, Sparkles, AlertCircle, Edit3 } from 'lucide-react';

export default function ProfileMeter({ percentage = 0, onEditProfile }) {
  const getMeterColor = () => {
    if (percentage >= 80) return 'from-emerald-500 to-teal-500';
    if (percentage >= 50) return 'from-amber-500 to-indigo-500';
    return 'from-indigo-600 to-purple-600';
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
            <p className="text-xs text-slate-500">
              {percentage === 100
                ? 'Your profile is fully optimized for employers'
                : 'Complete your profile to increase recruiter visibility'}
            </p>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200/80"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600">Completion Score</span>
          <span className="text-indigo-600">{percentage}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getMeterColor()} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
