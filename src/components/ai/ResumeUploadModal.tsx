import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X, ArrowRight } from 'lucide-react';
import { parseResumeTextWithAI } from '../../services/api';
import { ResumeData } from '../../types/resume';
import { BLANK_RESUME } from '../../data/defaultResumes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (resume: ResumeData) => void;
}

export const ResumeUploadModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Partial<ResumeData> | null>(null);
  const [stage, setStage] = useState<'input' | 'review'>('input');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read plain text or JSON
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsedJson = JSON.parse(content);
          if (parsedJson.personal || parsedJson.experience) {
            setParsedData(parsedJson);
            setStage('review');
            return;
          }
        } catch {
          // fallback to text
        }
      }
      setRawText(content);
    };
    reader.readAsText(file);
  };

  const handleParse = async () => {
    if (!rawText.trim() || rawText.length < 25) {
      setError('Please provide at least a few lines of resume text or upload a file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extracted = await parseResumeTextWithAI(rawText);
      setParsedData(extracted);
      setStage('review');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse resume text. Please check the text and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!parsedData) return;

    const newResume: ResumeData = {
      ...BLANK_RESUME,
      id: `res-${Date.now()}`,
      title: parsedData.title || parsedData.personal?.fullName ? `${parsedData.personal?.fullName} Resume` : 'Imported Resume',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      atsScore: 82,
      personal: {
        ...BLANK_RESUME.personal,
        ...(parsedData.personal || {}),
      },
      summary: parsedData.summary || '',
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      skills: parsedData.skills || [],
      projects: parsedData.projects || [],
      certifications: parsedData.certifications || [],
      languages: parsedData.languages || [],
      awards: parsedData.awards || [],
      volunteer: [],
      settings: {
        ...BLANK_RESUME.settings,
        template: 'professional',
      },
    };

    onSuccess(newResume);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {stage === 'input' ? 'Import Existing Resume' : 'Review Imported Information'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {stage === 'input' 
                  ? 'Paste raw resume text or upload your text/JSON file to parse into structured sections.'
                  : 'Verify extracted sections before saving into the editor.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {stage === 'input' ? (
            <>
              {/* File upload drag/drop zone */}
              <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center flex flex-col items-center justify-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer block">
                <UploadCloud size={32} className="text-indigo-600 mb-2" />
                <span className="text-sm font-semibold text-slate-800">
                  Click to browse or drop resume file
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports .txt, .json, and plain document files
                </span>
                <input 
                  type="file" 
                  accept=".txt,.json,.doc,.docx" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  disabled={loading}
                />
              </label>

              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OR PASTE TEXT</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your resume contents here (Personal info, experience, education, skills, projects)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono text-xs"
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            /* Review stage */
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="font-semibold">Extraction completed successfully! Check the extracted data below:</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Contact Info:</span>
                  <div className="text-slate-900 font-semibold mt-0.5">
                    {parsedData?.personal?.fullName || 'Name not detected'} ({parsedData?.personal?.jobTitle || 'Role'})
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {parsedData?.personal?.email} • {parsedData?.personal?.phone} • {parsedData?.personal?.location}
                  </div>
                </div>

                {parsedData?.summary && (
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Summary:</span>
                    <p className="text-slate-700 mt-0.5 line-clamp-3">{parsedData.summary}</p>
                  </div>
                )}

                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Experience ({parsedData?.experience?.length || 0} jobs):
                  </span>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-slate-700">
                    {parsedData?.experience?.map((e: any, i: number) => (
                      <li key={i} className="truncate">
                        <strong>{e.position}</strong> at {e.company} ({e.startDate} – {e.endDate || 'Present'})
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Skills ({parsedData?.skills?.length || 0} detected):
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {parsedData?.skills?.map((s: any, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-200 rounded text-slate-800 text-[10px] font-medium">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {stage === 'review' ? (
            <button
              onClick={() => setStage('input')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Back to edit text
            </button>
          ) : (
            <span className="text-[11px] text-slate-500">
              No data is fabricated during import.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {stage === 'input' ? (
              <button
                onClick={handleParse}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Extracting with AI...</span>
                  </>
                ) : (
                  <>
                    <span>Extract & Review</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleApply}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>Open in Resume Editor</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
