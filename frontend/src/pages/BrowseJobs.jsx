import React, { useState, useEffect, useMemo } from 'react';
import JobFilter from '../components/jobs/JobFilter';
import JobCard from '../components/jobs/JobCard';
import JobDetailModal from '../components/jobs/JobDetailModal';
import { Frown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function BrowseJobs() {
  const { isCandidate, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [candidateAppliedJobIds, setCandidateAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');

  // Selected Job for Modal
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated && isCandidate) {
      fetchCandidateApplications();
    }
  }, [isAuthenticated, isCandidate]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      if (response.data?.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      if (response.data?.success) {
        const ids = new Set((response.data.applications || []).map((app) => app.jobId?._id || app.jobId));
        setCandidateAppliedJobIds(ids);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setWorkModeFilter('All');
    setExperienceFilter('All');
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = searchQuery.toLowerCase();
      const titleMatch = job.title?.toLowerCase().includes(query);
      const companyMatch = job.company?.toLowerCase().includes(query);
      const skillMatch = job.skills?.some((sk) => sk.toLowerCase().includes(query));
      const matchesSearch = !query || titleMatch || companyMatch || skillMatch;

      const matchesWorkMode =
        workModeFilter === 'All' || job.workMode?.toLowerCase() === workModeFilter.toLowerCase();

      const matchesExperience =
        experienceFilter === 'All' || job.experienceLevel?.toLowerCase() === experienceFilter.toLowerCase();

      return matchesSearch && matchesWorkMode && matchesExperience;
    });
  }, [jobs, searchQuery, workModeFilter, experienceFilter]);

  const handleApplicationSubmitted = (jobId) => {
    setCandidateAppliedJobIds((prev) => new Set([...prev, jobId]));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Open Positions</h1>
        <p className="text-xs text-slate-500 mt-1">
          Discover verified opportunities and apply directly with your candidate profile.
        </p>
      </div>

      {/* Filter Toolbar */}
      <JobFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        workModeFilter={workModeFilter}
        setWorkModeFilter={setWorkModeFilter}
        experienceFilter={experienceFilter}
        setExperienceFilter={setExperienceFilter}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pb-2">
        <span>
          Showing <strong className="text-indigo-600 font-extrabold">{filteredJobs.length}</strong> available jobs
        </span>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onSelectJob={setSelectedJob}
              hasApplied={candidateAppliedJobIds.has(job._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 p-8 shadow-xs">
          <Frown className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching jobs found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or clearing filter criteria to explore all available listings.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-indigo-700 text-xs font-bold transition-colors border border-slate-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          hasApplied={candidateAppliedJobIds.has(selectedJob._id)}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}
    </div>
  );
}
