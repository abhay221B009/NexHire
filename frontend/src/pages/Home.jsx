import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Sparkles, Zap, ArrowRight, Building2, Users, FileText, CheckCircle2 } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobDetailModal from '../components/jobs/JobDetailModal';
import api from '../api/axios';

export default function Home({ onOpenPostJob }) {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await api.get('/jobs');
      if (response.data?.success) {
        setFeaturedJobs((response.data.jobs || []).slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-12 overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none animate-glow" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Modern Talent Acquisition Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Connect Top Talent with <br />
            <span className="gradient-text">World-Class Careers</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            NexHire empowers candidates to showcase verified profiles and enables recruiters to manage applicant pipelines seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl gradient-button text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Search className="w-4 h-4" />
              Explore Open Positions
            </Link>

            <Link
              to="/login?tab=signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Bank-Grade Account Security</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enterprise-grade authentication ensures candidate profiles, credentials, and recruitment data remain fully secure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Smart Resume Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant file validation for PDF and Microsoft Word resumes ensuring genuine file formats for recruiters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Real-Time Hiring Pipeline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent application tracking across Screening, Interview, Offer, and Hired stages for candidate visibility.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Job Opportunities</h2>
            <p className="text-xs text-slate-500 mt-1">Discover recently posted roles from top engineering teams</p>
          </div>

          <Link
            to="/jobs"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            View All Positions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} onSelectJob={setSelectedJob} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white border border-slate-200">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">No job postings available yet.</p>
          </div>
        )}
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
