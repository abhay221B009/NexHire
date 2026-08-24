import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { User, Phone, MapPin, Briefcase, GraduationCap, Plus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export default function ProfileEditModal({ isOpen, onClose, profile, onProfileUpdated }) {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setBio(profile.bio || '');
      setExperience(profile.experience !== undefined ? String(profile.experience) : '');
      setEducation(profile.education || '');
      setSkills(profile.skills || []);
    }
  }, [profile]);

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
    setLoading(true);

    const payload = {
      phone,
      location,
      bio,
      experience: experience !== '' ? Number(experience) : 0,
      education,
      skills,
    };

    try {
      let response;
      if (profile) {
        response = await api.put('/profile', payload);
      } else {
        response = await api.post('/profile', payload);
      }

      if (response.data?.success) {
        showSuccess('Candidate profile updated successfully!');
        if (onProfileUpdated) onProfileUpdated(response.data.profile);
        onClose();
      }
    } catch (error) {
      showError(error.customMessage || 'Failed to update candidate profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Candidate Profile" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (415) 890-2341"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Highest Education
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="B.S. Computer Science"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Skills Tag List
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
            Professional Summary / Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Briefly describe your career background, expertise, and target roles..."
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
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
