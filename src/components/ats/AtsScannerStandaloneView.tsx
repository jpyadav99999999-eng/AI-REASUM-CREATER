import React, { useState } from 'react';
import { ShieldCheck, Search, Sparkles, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { scanResumeATS } from '../../services/api';

interface Props {
  resumes: ResumeData[];
  activeResume: ResumeData | null;
  onOpenEditor: (resume: ResumeData) => void;
}

export const AtsScannerStandaloneView: React.FC<Props> = ({
  resumes,
  activeResume,
  onOpenEditor,
}) => {
  const [selectedResume, setSelectedResume] = useState<ResumeData>(activeResume || resumes[0]);
  const [jobTitle, setJobTitle] = useState(selectedResume?.targetJobTitle || '');
  const [jobDescription, setJobDescription] = useState(selectedResume?.targetJobDescription || '');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = async () => {
    if (!selectedResume) return;
    setLoading(true);
    try {
      const res = await scanResumeATS(selectedResume, jobTitle, jobDescription);
      setScanResult(res);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'ATS Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <ShieldCheck size={14} />
            <span>Enterprise ATS Diagnostics</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Applicant Tracking System (ATS) Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Over 75% of resumes are filtered before human recruiters review them. Test your resume against strict keyword density, layout compliance, and action-verb metrics.
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
              Simulated Pass Rate
            </span>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              {scanResult?.score ?? selectedResume?.atsScore ?? 85}%
            </div>
            <span className="text-[10px] text-slate-300">
              {scanResult?.grade ?? 'Good Pass Compatibility'}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Form Controls (5 cols) */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Target Audit Parameters
          </h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Resume to Audit
            </label>
            <select
              value={selectedResume?.id}
              onChange={(e) => {
                const found = resumes.find(r => r.id === e.target.value);
                if (found) {
                  setSelectedResume(found);
                  setJobTitle(found.targetJobTitle || '');
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.personal.fullName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Job Description (Paste for exact keyword matching)
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting text..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Running ATS Simulation...</span>
              </>
            ) : (
              <>
                <Search size={15} />
                <span>Run Full ATS Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Right Audit Results (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          
          {scanResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              
              {/* Summary */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  ATS Audit Executive Summary
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {scanResult.summary}
                </p>
              </div>

              {/* Missing keywords */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span>High-Value Keywords Missing from Resume</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(scanResult.missingKeywords || []).map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-amber-300 rounded-md text-amber-950 font-medium text-xs">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keyword matches */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle size={15} className="text-emerald-600" />
                  <span>Keywords Successfully Matched</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(scanResult.keywordMatches || []).map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-md text-emerald-950 font-medium text-xs">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onOpenEditor(selectedResume)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  <span>Open in Editor & Apply Keywords</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
              <ShieldCheck size={36} className="text-indigo-600 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Ready for Scan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure your target job parameters on the left and click "Run Full ATS Audit" to receive parsed keyword density and formatting scores.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
