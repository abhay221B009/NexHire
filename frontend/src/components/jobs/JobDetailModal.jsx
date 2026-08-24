import React, { useState } from 'react';
import Modal from '../common/Modal';
import { WorkModeBadge, SkillTag } from '../common/Badge';
import { Building2, MapPin, Briefcase, Calendar, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  hasApplied,
  onApplicationSubmitted,
}) {
  const { isAuthenticated, isCandidate, isRecruiter } = useAuth();
  const { showSuccess, showError } = useToast();
  const [applying, setApplying] = useState(false);

  if (!job) return null;

  const handleApply = async () => {
    if (!isAuthenticated) {
      showError('Please sign in to submit your job application.');
      return;
    }
    if (!isCandidate) {
      showError('Recruiter accounts cannot submit job applications.');
      return;
    }

    setApplying(true);
    try {
      const response = await api.post('/applications', { jobId: job._id });
      if (response.data?.success) {
        showSuccess('Application submitted successfully!');
        if (onApplicationSubmitted) onApplicationSubmitted(job._id);
        onClose();
      }
    } catch (error) {
      showError(error.customMessage || 'Failed to submit application. Make sure your profile & resume are updated.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={job.title} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header Block */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Building2 className="w-4 h-4" />
              {job.company}
            </div>
            <h2 className="text-xl font-black text-slate-900">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {job.experienceLevel || 'Mid Level'}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <WorkModeBadge mode={job.workMode} />
          </div>
        </div>

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <SkillTag key={index} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {/* Detailed Job Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Role Overview & Responsibilities
          </h4>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Bottom Application Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Apply instantly using your verified candidate profile</span>
          </div>

          {hasApplied ? (
            <div className="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Application Submitted
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="px-6 py-3 rounded-xl gradient-button text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {applying ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Apply Now <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
