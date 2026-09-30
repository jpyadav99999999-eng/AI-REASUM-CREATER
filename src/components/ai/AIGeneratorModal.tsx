import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { generateResumeWithAI } from '../../services/api';
import { ResumeData } from '../../types/resume';
import { BLANK_RESUME } from '../../data/defaultResumes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (resume: ResumeData) => void;
}

const EXAMPLE_PROMPTS = [
  {
    role: 'Video Editor & Motion Designer',
    prompt: 'I am a video editor with 3 years of experience. I work with Premiere Pro, After Effects and Photoshop. I have worked with social media brands and created reels, advertisements and YouTube videos that got millions of views.',
  },
  {
    role: 'Full Stack React Engineer',
    prompt: 'Senior Full Stack Developer with 5 years building scalable web apps with React, TypeScript, Node.js, and PostgreSQL. Reduced latency by 40% and led a team of 4 engineers.',
  },
  {
    role: 'Product Marketing Manager',
    prompt: 'Product marketing specialist with 4 years in B2B SaaS. Executed 6 product launches, grew lead pipeline by 150%, and managed $500k ad spend across LinkedIn and Google.',
  },
  {
    role: 'Fresh Computer Science Graduate',
    prompt: 'Recent Computer Science graduate from State University with a 3.8 GPA. Built a distributed key-value store in Go and an AI flashcard web app in React. Looking for junior software engineer roles.',
  },
];

export const AIGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [prompt, setPrompt] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const steps = [
    'Parsing your career background...',
    'Formulating high-impact XYZ bullet points...',
    'Injecting strong leadership action verbs...',
    'Structuring ATS-optimized sections...',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide some information about your background or target role.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const generated = await generateResumeWithAI(prompt, targetJobTitle);
      clearInterval(stepInterval);

      // Merge generated data with blank structure
      const newResume: ResumeData = {
        ...BLANK_RESUME,
        id: `res-${Date.now()}`,
        title: generated.title || targetJobTitle || 'AI Generated Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        atsScore: 85,
        targetJobTitle: targetJobTitle || generated.targetJobTitle || '',
        personal: {
          ...BLANK_RESUME.personal,
          ...(generated.personal || {}),
        },
        summary: generated.summary || '',
        experience: generated.experience || [],
        education: generated.education || [],
        skills: generated.skills || [],
        projects: generated.projects || [],
        certifications: generated.certifications || [],
        languages: generated.languages || [],
        awards: generated.awards || [],
        volunteer: [],
        settings: {
          ...BLANK_RESUME.settings,
          template: (generated as any).suggestedTemplate || 'professional',
        },
      };

      onSuccess(newResume);
      onClose();
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setError(err.message || 'Failed to generate resume. Please try again or refine your prompt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-300 ring-1 ring-white/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Create Resume with AI</h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Describe your real experience or prompt your target job. AI writes professional bullets without fabricating history.
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="font-semibold">Generation Notice:</strong> {error}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Target Job Title (Optional)
            </label>
            <input
              type="text"
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              placeholder="e.g. Senior Video Editor, Staff Software Engineer, Product Manager"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
              disabled={loading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Experience & Skills Summary <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Natural language prompt</span>
            </div>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell us about yourself: 'I am a video editor with 3 years of experience using Premiere Pro and After Effects. I worked with brands on reels and ads that got millions of views...'"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 resize-none"
              disabled={loading}
            />
          </div>

          {/* Quick prompt suggestions */}
          <div>
            <span className="text-xs font-semibold text-slate-600 mb-2 block">
              Or pick an example starting point:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(ex.prompt);
                    setTargetJobTitle(ex.role);
                  }}
                  disabled={loading}
                  className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs text-slate-700 group cursor-pointer"
                >
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-0.5">
                    {ex.role}
                  </div>
                  <div className="text-slate-500 line-clamp-2 text-[11px]">
                    {ex.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Loading status bar */}
          {loading && (
            <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin text-indigo-600" />
                  Generating your resume with Gemini AI...
                </span>
                <span>{progressStep + 1} of {steps.length}</span>
              </div>
              <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-700 ease-out"
                  style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-indigo-700 italic">
                {steps[progressStep]}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Factual integrity enforced: AI will not invent fake degrees or jobs.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  <span>Generate Full Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
