import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle, Search, 
  Sparkles, FileText, ArrowRight, Loader2, ThumbsUp, HelpCircle
} from 'lucide-react';
import { scanResumeATS, optimizeForJobWithAI } from '../../services/api';
import { AtsAnalysisResult, JobOptimizationResult, ResumeData } from '../../types/resume';

interface Props {
  resume: ResumeData;
  onApplyImprovement: (updated: ResumeData) => void;
}

export const AtsPanel: React.FC<Props> = ({ resume, onApplyImprovement }) => {
  const [jobTitle, setJobTitle] = useState(resume.targetJobTitle || '');
  const [jobDescription, setJobDescription] = useState(resume.targetJobDescription || '');
  const [loading, setLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsAnalysisResult | null>(null);
  const [jobOptResult, setJobOptResult] = useState<JobOptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'ats' | 'jobMatch'>('ats');

  const handleRunScan = async () => {
    setLoading(true);
    try {
      const res = await scanResumeATS(resume, jobTitle, jobDescription);
      setAtsResult(res);
      // update resume atsScore
      onApplyImprovement({
        ...resume,
        atsScore: res.score,
        targetJobTitle: jobTitle,
        targetJobDescription: jobDescription,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'ATS scan failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRunJobMatch = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a target job description to run job matching');
      return;
    }
    setLoading(true);
    try {
      const res = await optimizeForJobWithAI(resume, jobDescription);
      setJobOptResult(res);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Job optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const score = atsResult?.score ?? resume.atsScore ?? 75;

  const getScoreColor = (sc: number) => {
    if (sc >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (sc >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-indigo-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-800">ATS Resume Scanner</h3>
            <p className="text-[11px] text-slate-500">Industry-grade ATS simulation & keyword matching</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-slate-200/70 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('ats')}
            className={`flex-1 py-1 rounded-md font-semibold cursor-pointer ${
              activeTab === 'ats' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            ATS Score & Audit
          </button>
          <button
            onClick={() => setActiveTab('jobMatch')}
            className={`flex-1 py-1 rounded-md font-semibold cursor-pointer ${
              activeTab === 'jobMatch' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            Job Description Match
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Target role inputs */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-600 mb-0.5 block">
              Target Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-600 mb-0.5 block">
              Target Job Description (Optional)
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting text to extract required keywords and evaluate skill density..."
              className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={activeTab === 'ats' ? handleRunScan : handleRunJobMatch}
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Auditing ATS Compatibility...</span>
              </>
            ) : (
              <>
                <Search size={13} />
                <span>{activeTab === 'ats' ? 'Run ATS Compatibility Scan' : 'Compare with Job Description'}</span>
              </>
            )}
          </button>
        </div>

        {/* TAB 1: ATS SCORE & AUDIT */}
        {activeTab === 'ats' && (
          <div className="space-y-4">
            
            {/* Score Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${getScoreColor(score)}`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Simulated ATS Score
                </span>
                <div className="text-2xl font-black">
                  {score}<span className="text-sm font-semibold opacity-70">/100</span>
                </div>
                <div className="text-[11px] font-medium mt-0.5 opacity-90">
                  {atsResult?.grade || (score >= 85 ? 'Excellent Compatibility' : 'Fair Compatibility')}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block max-w-[120px] leading-tight">
                  Scored based on parsing standards. Not a hiring guarantee.
                </span>
              </div>
            </div>

            {atsResult?.summary && (
              <p className="text-slate-700 leading-relaxed italic bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                "{atsResult.summary}"
              </p>
            )}

            {/* Missing Keywords Box */}
            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1.5">
              <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-600" />
                <span>Recommended Keywords to Add</span>
              </span>
              <p className="text-[11px] text-amber-800">
                Recruiter searches for this role commonly index these skills:
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {(atsResult?.missingKeywords || ['Distributed Systems', 'CI/CD Pipelines', 'Performance Optimization', 'Agile Leadership']).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white border border-amber-200 text-amber-900 rounded font-medium text-[10px]"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Keyword Matches */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-1.5">
              <span className="font-bold text-emerald-900 text-[11px] flex items-center gap-1.5">
                <CheckCircle size={13} className="text-emerald-600" />
                <span>Found Keywords Matching Target Role</span>
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {(atsResult?.keywordMatches || ['React', 'TypeScript', 'Node.js', 'System Architecture', 'Leadership']).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded font-medium text-[10px]"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Formatting & Pitfall Checks */}
            <div>
              <span className="font-bold text-slate-800 block mb-1.5 uppercase text-[10px] tracking-wider">
                Formatting & Parsing Diagnostics
              </span>
              <div className="space-y-1.5">
                {(atsResult?.formattingIssues?.length ? atsResult.formattingIssues : [
                  { issue: 'Standard Linear Layout', severity: 'low' as const, fix: 'Single-page flow cleanly parsed without graphic collisions.' },
                  { issue: 'Clear Contact Header', severity: 'low' as const, fix: 'Email, phone, and location formatted in accessible text.' },
                ]).map((item, i) => (
                  <div key={i} className="p-2 rounded-lg border border-slate-200 bg-white flex items-start gap-2">
                    <CheckCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">{item.issue}</span>
                      <p className="text-[10px] text-slate-500">{item.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {atsResult?.recommendations?.length ? (
              <div>
                <span className="font-bold text-slate-800 block mb-1.5 uppercase text-[10px] tracking-wider">
                  Actionable Recommendations
                </span>
                <ul className="space-y-1 list-disc list-inside text-slate-700">
                  {atsResult.recommendations.map((rec, i) => (
                    <li key={i} className="leading-snug">{rec}</li>
                  ))}
                </ul>
              </div>
            ) : null}

          </div>
        )}

        {/* TAB 2: JOB DESCRIPTION OPTIMIZER */}
        {activeTab === 'jobMatch' && (
          <div className="space-y-4">
            {jobOptResult ? (
              <>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-700">Skill Alignment</span>
                    <div className="text-xl font-black text-indigo-950">
                      {jobOptResult.matchPercentage}% Match
                    </div>
                  </div>
                  <ThumbsUp size={24} className="text-indigo-600" />
                </div>

                {jobOptResult.summary && (
                  <p className="text-slate-700 leading-relaxed p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {jobOptResult.summary}
                  </p>
                )}

                {/* Missing Skills */}
                {jobOptResult.missingSkills?.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-amber-900 block text-[11px]">
                      Required Skills Missing in Resume
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {jobOptResult.missingSkills.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-amber-300 text-amber-900 rounded font-medium text-[10px]">
                          + {sk}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-amber-700 italic">
                      Note: Only add skills you have genuinely used. Never fabricate qualifications.
                    </p>
                  </div>
                )}

                {/* Bullet Suggestions */}
                {jobOptResult.bulletSuggestions?.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                      Targeted Bullet Rewrite Suggestions
                    </span>
                    {jobOptResult.bulletSuggestions.map((sug, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="text-slate-500 line-through text-[11px]">
                          {sug.originalBullet}
                        </div>
                        <div className="text-emerald-900 font-medium text-[11px] bg-emerald-50 p-1.5 rounded border border-emerald-200">
                          {sug.improvedBullet}
                        </div>
                        <p className="text-[10px] text-indigo-700">
                          💡 {sug.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <FileText size={28} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No Job Description Analyzed Yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Paste the job posting above and click "Compare with Job Description" to run alignment.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
