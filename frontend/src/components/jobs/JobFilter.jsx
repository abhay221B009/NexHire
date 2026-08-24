import React from 'react';
import { Search, Filter, RotateCcw, ChevronDown } from 'lucide-react';

export default function JobFilter({
  searchQuery,
  setSearchQuery,
  workModeFilter,
  setWorkModeFilter,
  experienceFilter,
  setExperienceFilter,
  onReset,
}) {
  const workModes = ['All', 'Remote', 'Hybrid', 'Onsite'];
  const experienceLevels = [
    'All',
    'Entry Level',
    'Mid-Level',
    'Senior Level',
    'Lead / Executive',
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Bar */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company name, or skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs font-semibold placeholder:text-slate-400"
          />
        </div>

        {/* Experience Dropdown */}
        <div className="md:col-span-4 relative">
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 pr-9 rounded-2xl glass-input text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <option value="All">All Experience Levels</option>
            {experienceLevels.filter((lvl) => lvl !== 'All').map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Reset Filters Button */}
        <div className="md:col-span-2">
          <button
            onClick={onReset}
            className="w-full h-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset
          </button>
        </div>
      </div>

      {/* Work Mode Quick Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" /> Work Mode:
        </span>

        {workModes.map((mode) => (
          <button
            key={mode}
            onClick={() => setWorkModeFilter(mode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              workModeFilter === mode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
