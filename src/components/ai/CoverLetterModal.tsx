import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Check, Download, X, Loader2, RefreshCw } from 'lucide-react';
import { generateCoverLetterWithAI } from '../../services/api';
import { CoverLetterData, ResumeData } from '../../types/resume';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const CoverLetterModal: React.FC<Props> = ({ isOpen, onClose, resume }) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState(resume.targetJobTitle || resume.personal.jobTitle || '');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState<'Professional & Confident' | 'Enthusiastic' | 'Executive & Strategic' | 'Modern & Creative'>('Professional & Confident');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const [recipient, setRecipient] = useState('Hiring Manager');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!companyName.trim() || !jobTitle.trim()) {
      return;
    }
    setLoading(true);
    try {
      const result = await generateCoverLetterWithAI(
        resume,
        companyName,
        jobTitle,
        jobDescription,
        tone
      );
      setRecipient(result.recipientName || 'Hiring Manager');
      setLetterContent(result.content);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textData = `
${resume.personal.fullName}
${resume.personal.email} | ${resume.personal.phone} | ${resume.personal.location}

${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

${recipient}
${companyName}

Subject: Application for ${jobTitle}

${letterContent}

Sincerely,
${resume.personal.fullName}
    `.trim();

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AI Cover Letter Generator</h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Targeted cover letter crafted from your real resume experience and the prospective company.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Inputs (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Netflix, Google"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Professional & Confident">Professional & Confident</option>
                <option value="Executive & Strategic">Executive & Strategic</option>
                <option value="Enthusiastic">Enthusiastic</option>
                <option value="Modern & Creative">Modern & Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Job Description (Optional)
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key requirements or job description from job board..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !companyName.trim() || !jobTitle.trim()}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Writing Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>{letterContent ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}</span>
                </>
              )}
            </button>
          </div>

          {/* Right Letter Canvas (7 cols) */}
          <div className="md:col-span-7 flex flex-col bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[380px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Letter Preview & Live Edit
              </span>
              {letterContent && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    title="Download document"
                  >
                    <Download size={14} />
                    <span className="text-[11px]">Download</span>
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 size={28} className="animate-spin text-indigo-600" />
                <span className="text-xs">Analyzing resume achievements for {companyName || 'the role'}...</span>
              </div>
            ) : letterContent ? (
              <textarea
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                className="flex-1 w-full bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Mail size={36} className="text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-600">Enter company details to generate your cover letter</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  AI will review your achievements and tailor a compelling pitch without inventing experience.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
