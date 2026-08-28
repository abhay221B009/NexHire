import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export default function ResumeUpload({ resume, onResumeUploaded }) {
  const { showSuccess, showError } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  // HTML5 Drag & Drop File Event Handlers:
  // Intercepts browser default drag behavior (e.preventDefault()) and reads dropped files from e.dataTransfer.files
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  // Resume File Upload Handler:
  // 1. Client-Side Size Guard: Checks file.size against 5MB limit before making network request.
  // 2. FormData Construction: Wraps binary file buffer inside standard multipart/form-data payload.
  // 3. API Dispatch: Sends POST request to /api/profile/resume for server-side magic-byte inspection.
  const uploadFile = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      showError('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const response = await api.post('/profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        showSuccess('Resume uploaded and verified successfully!');
        if (onResumeUploaded) onResumeUploaded(response.data.resume, response.data.completePercentage);
      }
    } catch (error) {
      showError(error.customMessage || 'Resume upload failed. Please attach a valid PDF or DOCX file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    window.open('/api/profile/resume', '_blank');
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Resume Upload & Verification
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Supports PDF & Word DOCX formats (Max 5MB)
          </p>
        </div>

        {resume && (
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-indigo-200/80"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50'
            : resume
            ? 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-400'
            : 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-7 h-7 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-700">Verifying & uploading resume file...</span>
          </div>
        ) : resume ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">{resume.originalName || 'Resume.pdf'}</span>
            <span className="text-[11px] text-slate-500">
              {(resume.size ? (resume.size / 1024).toFixed(1) : '150')} KB • Verified File
            </span>
            <span className="mt-1 text-xs text-indigo-600 font-semibold hover:underline">
              Click or drag file to replace resume
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
              <UploadCloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              Click to select or drag and drop your resume
            </span>
            <span className="text-[11px] text-slate-500">Accepted formats: PDF or DOCX up to 5MB</span>
          </div>
        )}
      </div>
    </div>
  );
}
