import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProfileMeter from '../components/profile/ProfileMeter';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import ResumeUpload from '../components/profile/ResumeUpload';
import PostJobModal from '../components/jobs/PostJobModal';
import JobApplicationsModal from '../components/recruiter/JobApplicationsModal';
import { StageBadge, WorkModeBadge, SkillTag } from '../components/common/Badge';
import {
  Briefcase,
  Users,
  FileText,
  PlusCircle,
  Building2,
  Trash2,
  CheckCircle2,
  User,
  MapPin,
  Phone,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios';

export default function Dashboard({ isPostJobOpen, onClosePostJob }) {
  const { user, isCandidate, isRecruiter } = useAuth();
  const { showSuccess, showError } = useToast();

  // Candidate State
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Recruiter State
  const [myJobs, setMyJobs] = useState([]);
  const [loadingMyJobs, setLoadingMyJobs] = useState(false);
  const [selectedJobForApps, setSelectedJobForApps] = useState(null);

  useEffect(() => {
    if (isCandidate) {
      fetchProfile();
      fetchApplications();
    } else if (isRecruiter) {
      fetchMyJobs();
    }
  }, [isCandidate, isRecruiter]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await api.get('/profile');
      if (response.data?.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error('Failed to fetch profile:', error);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const response = await api.get('/applications/my-applications');
      if (response.data?.success) {
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchMyJobs = async () => {
    setLoadingMyJobs(true);
    try {
      const response = await api.get('/jobs/recruiter/my-jobs');
      if (response.data?.success) {
        setMyJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch recruiter jobs:', error);
    } finally {
      setLoadingMyJobs(false);
    }
  };

  const handleToggleJobActive = async (jobId, currentStatus) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, { isActive: !currentStatus });
      if (response.data?.success) {
        showSuccess(`Job listing marked as ${!currentStatus ? 'Active' : 'Inactive'}`);
        setMyJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, isActive: !currentStatus } : j))
        );
      }
    } catch (error) {
      showError(error.customMessage || 'Failed to update job listing status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job opportunity?')) return;
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      if (response.data?.success) {
        showSuccess('Job listing removed successfully');
        setMyJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (error) {
      showError(error.customMessage || 'Failed to remove job posting');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isCandidate ? 'Candidate Portal' : 'Employer Workspace'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            {isCandidate
              ? 'Update your professional details, upload your resume, and track active applications.'
              : 'Publish job openings, review candidate applications, and manage recruitment stages.'}
          </p>
        </div>

        {isRecruiter && (
          <button
            onClick={onClosePostJob}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl gradient-button text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Opportunity
          </button>
        )}
      </div>

      {/* CANDIDATE VIEW */}
      {isCandidate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Resume */}
          <div className="space-y-6">
            <ProfileMeter
              percentage={profile?.completePercentage || 0}
              onEditProfile={() => setIsEditProfileOpen(true)}
            />

            <ResumeUpload
              resume={profile?.resume}
              onResumeUploaded={(res, newPct) => {
                setProfile((prev) => ({
                  ...(prev || {}),
                  resume: res,
                  completePercentage: newPct,
                }));
              }}
            />

            {/* Personal Details Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" /> Personal Overview
                </h3>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-bold text-slate-800">{profile?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">Location:</span>
                  <span className="font-bold text-slate-800">{profile?.location || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">Experience:</span>
                  <span className="font-bold text-slate-800">
                    {profile?.experience !== undefined ? `${profile.experience} Years` : 'Not specified'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">Education:</span>
                  <span className="font-bold text-slate-800">{profile?.education || 'Not provided'}</span>
                </div>
              </div>

              {profile?.skills && profile.skills.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Skills Tag List
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s, idx) => (
                      <SkillTag key={idx} skill={s} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Applications Tracker */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">My Applications</h2>
                <p className="text-xs text-slate-500">Track stage updates and application status in real-time</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-indigo-700 font-bold border border-slate-200">
                {applications.length} Total
              </span>
            </div>

            {loadingApps ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => {
                  const job = app.jobId || {};
                  return (
                    <div
                      key={app._id}
                      className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {job.company || 'Company'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{job.title || 'Position'}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>{job.location || 'Remote'}</span>
                          <span>•</span>
                          <WorkModeBadge mode={job.workMode} />
                          <span>•</span>
                          <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <StageBadge stage={app.stage} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 p-8 shadow-xs">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No applications submitted yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse open positions to apply directly using your candidate profile.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECRUITER VIEW */}
      {isRecruiter && (
        <div className="space-y-8">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Published Job Listings
              </div>
              <div className="text-3xl font-black text-slate-900">{myJobs.length}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Active Listings
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {myJobs.filter((j) => j.isActive).length}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Recruitment Mode
              </div>
              <div className="text-2xl font-black text-indigo-600 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Accepting Candidates
              </div>
            </div>
          </div>

          {/* Posted Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">My Published Positions</h2>
              <span className="text-xs text-slate-500">Manage job status & review applicants</span>
            </div>

            {loadingMyJobs ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            job.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                        <span>{job.company}</span>
                        <span>•</span>
                        <span>{job.location || 'Remote'}</span>
                        <span>•</span>
                        <WorkModeBadge mode={job.workMode} />
                        <span>•</span>
                        <span>{job.experienceLevel}</span>
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.skills.map((sk, idx) => (
                            <SkillTag key={idx} skill={sk} />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setSelectedJobForApps(job)}
                        className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        View Applicants
                      </button>

                      <button
                        onClick={() => handleToggleJobActive(job._id, job.isActive)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
                        title={job.isActive ? 'Mark Inactive' : 'Mark Active'}
                      >
                        {job.isActive ? 'Pause' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors border border-rose-200"
                        title="Remove Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 p-8 shadow-xs">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No jobs published yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Click "Post New Opportunity" to start accepting applications from top talent.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {isEditProfileOpen && (
        <ProfileEditModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          profile={profile}
          onProfileUpdated={(updated) => setProfile(updated)}
        />
      )}

      {selectedJobForApps && (
        <JobApplicationsModal
          job={selectedJobForApps}
          isOpen={!!selectedJobForApps}
          onClose={() => setSelectedJobForApps(null)}
        />
      )}
    </div>
  );
}
