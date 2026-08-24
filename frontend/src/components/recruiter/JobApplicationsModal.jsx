import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ApplicantCard from './ApplicantCard';
import { Users, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export default function JobApplicationsModal({ job, isOpen, onClose }) {
  const { showError } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job && isOpen) {
      fetchJobApplications();
    }
  }, [job, isOpen]);

  const fetchJobApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/applications/job/${job._id}`);
      if (response.data?.success) {
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      showError(error.customMessage || 'Failed to fetch applicants for this job posting');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdated = (appId, newStage) => {
    setApplications((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, stage: newStage } : app))
    );
  };

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Applicants for ${job.title}`} maxWidth="max-w-4xl">
      <div className="space-y-5">
        {/* Header summary */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Users className="w-4 h-4 text-indigo-600" />
            Total Candidate Applications: <span className="text-indigo-700 font-extrabold">{applications.length}</span>
          </div>
          <span className="text-xs font-bold text-slate-500">{job.company}</span>
        </div>

        {/* List */}
        {loading ? (
          <div className="py-12 text-center flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-500">Loading candidate applications...</span>
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {applications.map((app) => (
              <ApplicantCard key={app._id} application={app} onStatusUpdated={handleStatusUpdated} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl bg-slate-50 border border-slate-200 p-8">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 mb-1">No Applications Received Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Candidates who apply to this role will appear here in real time for recruiter review.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
