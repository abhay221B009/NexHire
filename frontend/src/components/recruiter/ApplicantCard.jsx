 import React, { useState } from 'react';
import { StageBadge, SkillTag } from '../common/Badge';
import {
  Mail,
  Phone,
  MapPin,
  Download,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export default function ApplicantCard({ application, onStatusUpdated }) {
  const { showSuccess, showError } = useToast();

  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentStage, setCurrentStage] = useState(
    application.stage || 'Applied'
  );

  const candidate = application.candidateId || {};
  const profile = application.candidateProfile || {};

  const stages = [
    'Applied',
    'Screening',
    'Interview',
    'Shortlisted',
    'Offer',
    'Hired',
    'Rejected',
  ];

  const candidateId = candidate._id || candidate;

  const handleStageChange = async (newStage) => {
    if (newStage === currentStage) return;

    setUpdating(true);

    try {
      const response = await api.patch(
        `/applications/${application._id}/status`,
        {
          stage: newStage,
        }
      );

      if (response.data?.success) {
        setCurrentStage(newStage);

        showSuccess(
          `Candidate moved to stage: ${newStage}`
        );

        if (onStatusUpdated) {
          onStatusUpdated(
            application._id,
            newStage
          );
        }
      }
    } catch (error) {
      showError(
        error.customMessage ||
          'Failed to update candidate application status'
      );
    } finally {
      setUpdating(false);
    }
  };

  // ------------------------------------------------------------
  // DOWNLOAD CANDIDATE RESUME
  // ------------------------------------------------------------
  //
  // We intentionally use Axios instead of a normal <a> tag.
  //
  // Axios is configured with withCredentials: true, so the
  // authenticated HTTP-only JWT cookie is sent to the backend.
  //
  // The backend returns the resume as binary data.
  // We convert that response into a browser Blob and trigger
  // the download locally.
  // ------------------------------------------------------------

  const handleResumeDownload = async () => {
    if (!candidateId) {
      showError('Candidate information is unavailable');
      return;
    }

    setDownloading(true);

    try {
      const response = await api.get(
        `/profile/resume/${candidateId}`,
        {
          responseType: 'blob',
        }
      );

      const contentType =
        response.headers?.['content-type'] ||
        'application/octet-stream';

      const blob = new Blob(
        [response.data],
        {
          type: contentType,
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        profile.resume?.originalName ||
        'candidate-resume';

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      showSuccess('Resume downloaded successfully');
    } catch (error) {
      console.error(
        'Resume download error:',
        error
      );

      showError(
        error.customMessage ||
          'Failed to download candidate resume'
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4">

      {/* Candidate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center shrink-0">
            {candidate.name
              ? candidate.name
                  .charAt(0)
                  .toUpperCase()
              : 'C'}
          </div>

          <div>

            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">

              {candidate.name || 'Candidate'}

              {profile.completePercentage !==
                undefined && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-indigo-700 border border-slate-200">
                  {profile.completePercentage}%
                  Complete
                </span>
              )}

            </h4>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium mt-0.5">

              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {candidate.email}
              </span>

              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone}
                </span>
              )}

              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
              )}

            </div>
          </div>
        </div>

        {/* Recruitment Stage Selector */}
        <div className="flex items-center gap-2">

          <label className="text-xs font-bold text-slate-400 hidden sm:inline">
            Stage:
          </label>

          <div className="relative">

            <select
              value={currentStage}
              disabled={updating}
              onChange={(e) =>
                handleStageChange(
                  e.target.value
                )
              }
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 cursor-pointer hover:bg-slate-100"
            >
              {stages.map((stg) => (
                <option
                  key={stg}
                  value={stg}
                >
                  {stg}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

          </div>
        </div>
      </div>

      {/* Profile Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

        <div>

          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Experience & Education
          </span>

          <div className="space-y-1 text-slate-700 font-medium">

            {profile.experience !==
              undefined && (
              <div className="flex items-center gap-1.5">

                <Briefcase className="w-3.5 h-3.5 text-purple-600" />

                <span>
                  {profile.experience}{' '}
                  Years Professional
                  Experience
                </span>

              </div>
            )}

            {profile.education && (
              <div className="flex items-center gap-1.5">

                <GraduationCap className="w-3.5 h-3.5 text-teal-600" />

                <span>
                  {profile.education}
                </span>

              </div>
            )}

          </div>
        </div>

        <div>

          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Skills Tag List
          </span>

          <div className="flex flex-wrap gap-1">

            {profile.skills &&
            profile.skills.length > 0 ? (
              profile.skills.map(
                (sk, idx) => (
                  <SkillTag
                    key={idx}
                    skill={sk}
                  />
                )
              )
            ) : (
              <span className="text-slate-400 italic">
                No skills listed
              </span>
            )}

          </div>
        </div>
      </div>

      {/* Candidate Bio */}
      {profile.bio && (
        <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 italic border border-slate-100">
          "{profile.bio}"
        </div>
      )}

      {/* Recruiter Resume Download */}
      {profile.resume?.originalName && (
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100">

          <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">

            <CheckCircle2 className="w-4 h-4 text-emerald-600" />

            Resume Attached (
            {profile.resume.originalName}
            )

          </span>

          <button
            type="button"
            onClick={handleResumeDownload}
            disabled={downloading}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-indigo-200/80"
          >
            <Download className="w-3.5 h-3.5" />

            {downloading
              ? 'Downloading...'
              : 'Download Candidate Resume'}
          </button>

        </div>
      )}

    </div>
  );
}