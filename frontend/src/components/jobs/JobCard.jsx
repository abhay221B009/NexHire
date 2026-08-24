import React from 'react';
import { WorkModeBadge, SkillTag } from '../common/Badge';
import { Building2, MapPin, Briefcase, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function JobCard({ job, onSelectJob, hasApplied }) {
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'Recent';

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200 shadow-xs hover:shadow-md transition-all group">
      <div className="space-y-4">
        {/* Header: Company & Work Mode */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center shrink-0">
              {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 block flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {job.company}
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>

          <WorkModeBadge mode={job.workMode} />
        </div>

        {/* Job Meta Info */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-medium pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location || 'Remote'}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.experienceLevel || 'Mid Level'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {postedDate}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tag Cloud */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((skill, index) => (
              <SkillTag key={index} skill={skill} />
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
        {hasApplied ? (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Applied
          </span>
        ) : (
          <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
            View Role & Apply
          </span>
        )}

        <button
          onClick={() => onSelectJob(job)}
          className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-colors shadow-xs"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
