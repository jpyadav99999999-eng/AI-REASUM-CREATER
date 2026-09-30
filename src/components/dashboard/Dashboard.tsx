import React, { useState } from 'react';
import { 
  Sparkles, Plus, UploadCloud, FileText, MoreVertical, 
  Trash2, Copy, Download, Share2, Edit3, ShieldCheck, 
  Clock, Search, CheckCircle, ArrowRight
} from 'lucide-react';
import { ResumeData, UserProfile } from '../../types/resume';
import { downloadResumePDF } from '../../utils/pdfExport';

interface Props {
  resumes: ResumeData[];
  user: UserProfile;
  onCreateWithAI: () => void;
  onCreateManual: () => void;
  onUploadResume: () => void;
  onSelectResume: (resume: ResumeData) => void;
  onDuplicateResume: (resume: ResumeData) => void;
  onDeleteResume: (id: string) => void;
  onRenameResume: (id: string, newTitle: string) => void;
  onShareResume: (resume: ResumeData) => void;
}

export const Dashboard: React.FC<Props> = ({
  resumes,
  user,
  onCreateWithAI,
  onCreateManual,
  onUploadResume,
  onSelectResume,
  onDuplicateResume,
  onDeleteResume,
  onRenameResume,
  onShareResume,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');

  const filteredResumes = resumes.filter((r) => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.personal.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.settings.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateCompletion = (r: ResumeData) => {
    let score = 0;
    if (r.personal.fullName && r.personal.email) score += 20;
    if (r.summary && r.summary.length > 50) score += 20;
    if (r.experience && r.experience.length > 0) score += 25;
    if (r.education && r.education.length > 0) score += 15;
    if (r.skills && r.skills.length >= 3) score += 10;
    if (r.projects && r.projects.length > 0) score += 10;
    return Math.min(100, score);
  };

  const startRename = (r: ResumeData) => {
    setEditingTitleId(r.id);
    setTempTitle(r.title);
  };

  const saveRename = (id: string) => {
    if (tempTitle.trim()) {
      onRenameResume(id, tempTitle.trim());
    }
    setEditingTitleId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles size={13} />
            <span>AI-Powered Career Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Create high-converting, ATS-friendly resumes and tailored cover letters in minutes. Choose from 10 executive templates or craft from prompt.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onCreateWithAI}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Create with AI</span>
            </button>

            <button
              onClick={onCreateManual}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Build Manually</span>
            </button>

            <button
              onClick={onUploadResume}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <UploadCloud size={16} />
              <span>Upload Resume</span>
            </button>
          </div>
        </div>

        {/* Abstract graphic accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Resumes
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {resumes.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">All synced & autosaved</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Avg. ATS Score
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 80), 0) / (resumes.length || 1))}/100
          </div>
          <span className="text-[11px] text-indigo-500 font-medium">Industry standard parsed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Templates Ready
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            10
          </div>
          <span className="text-[11px] text-slate-500">Corporate, Tech, Creative, ATS</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            AI Enhancements
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            Active
          </div>
          <span className="text-[11px] text-slate-500">Gemini 3.8 Flash Engine</span>
        </div>
      </div>

      {/* My Resumes Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            My Resumes ({filteredResumes.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, duplicate, edit and download your personalized resume variations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resumes..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No resumes found</h3>
          <p className="text-xs text-slate-500">
            Create your first professional, ATS-optimized resume using AI in under 2 minutes.
          </p>
          <button
            onClick={onCreateWithAI}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Create with AI</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => {
            const completion = calculateCompletion(resume);
            const isEditing = editingTitleId === resume.id;

            return (
              <div
                key={resume.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
              >
                
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveRename(resume.id)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-900 border border-indigo-400 rounded focus:outline-none w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(resume.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <CheckCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group/title">
                        <h3 
                          onClick={() => onSelectResume(resume)}
                          className="font-bold text-sm text-slate-900 truncate cursor-pointer hover:text-indigo-600"
                        >
                          {resume.title}
                        </h3>
                        <button
                          onClick={() => startRename(resume)}
                          className="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                          title="Rename resume"
                        >
                          <Edit3 size={11} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="capitalize px-1.5 py-0.2 rounded bg-slate-100 font-medium text-slate-700">
                        {resume.settings.template}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>Edited {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* ATS Badge */}
                  <div className="px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs shrink-0 flex items-center gap-1">
                    <ShieldCheck size={13} />
                    <span>{resume.atsScore || 85}</span>
                  </div>
                </div>

                {/* Card Preview Body */}
                <div 
                  onClick={() => onSelectResume(resume)}
                  className="p-5 flex-1 bg-gradient-to-b from-slate-50/60 to-white cursor-pointer relative overflow-hidden group/canvas"
                >
                  <div className="border border-slate-200 rounded-lg p-3 bg-white shadow-2xs text-[9px] text-slate-600 space-y-1.5 pointer-events-none select-none">
                    <div className="font-bold text-slate-900 text-[11px] truncate">
                      {resume.personal.fullName || 'Candidate Name'}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {resume.personal.jobTitle || 'Target Position'}
                    </div>
                    <div className="h-px bg-slate-100 my-1" />
                    <p className="line-clamp-2 text-slate-600 text-[9px]">
                      {resume.summary || 'Click to open in editor and write your summary...'}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {resume.skills?.slice(0, 4).map((s) => (
                        <span key={s.id} className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 text-[8px]">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-2xs opacity-0 group-hover/canvas:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
                      <span>Open Editor</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  
                  {/* Completion indicator */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-14 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${completion}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{completion}%</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateResume(resume)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Resume"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => onShareResume(resume)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                      title="Share link"
                    >
                      <Share2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        onSelectResume(resume);
                        setTimeout(() => {
                          const safeName = (resume.personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_');
                          downloadResumePDF('resume-canvas-content', `${safeName}_Resume.pdf`);
                        }, 300);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                      title="Quick Download PDF"
                    >
                      <Download size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${resume.title}"?`)) {
                          onDeleteResume(resume.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Resume"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
