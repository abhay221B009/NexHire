import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Plus, X, Briefcase, Building2, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export default function PostJobModal({ isOpen, onClose, onJobCreated }) {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !company || !location || !description) {
      showError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/jobs', {
        title,
        company,
        location,
        workMode,
        experienceLevel,
        description,
        skills,
      });

      if (response.data?.success) {
        showSuccess('Job opportunity published successfully!');
        if (onJobCreated) onJobCreated(response.data.job);
        onClose();
      }
    } catch (error) {
      showError(error.customMessage || 'Failed to publish job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish New Job Opportunity" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Stripe Tech"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Work Mode *
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Experience *
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead / Executive">Lead / Executive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Required Skills
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type skill and click Add (e.g. React)"
              className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs font-semibold"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Add
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-indigo-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Description & Requirements *
          </label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a overview of the role, responsibilities, and team culture..."
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl gradient-button text-white font-bold text-xs shadow-sm flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Publish Job'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
