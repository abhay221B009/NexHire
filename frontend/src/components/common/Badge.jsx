import React from 'react';

export function WorkModeBadge({ mode }) {
  const styles = {
    remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hybrid: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    onsite: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const key = (mode || '').toLowerCase();
  const style = styles[key] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {mode || 'Remote'}
    </span>
  );
}

export function StageBadge({ stage }) {
  const stages = {
    applied: 'bg-blue-50 text-blue-700 border-blue-200',
    screening: 'bg-purple-50 text-purple-700 border-purple-200',
    interview: 'bg-amber-50 text-amber-800 border-amber-200',
    shortlisted: 'bg-teal-50 text-teal-700 border-teal-200',
    offer: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
    hired: 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const key = (stage || 'Applied').toLowerCase();
  const style = stages[key] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-semibold border inline-flex items-center gap-1.5 ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {stage || 'Applied'}
    </span>
  );
}

export function SkillTag({ skill }) {
  return (
    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 text-[11px] font-semibold hover:bg-slate-200/60 transition-colors">
      {skill}
    </span>
  );
}
