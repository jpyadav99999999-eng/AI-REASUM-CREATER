import React, { useState } from 'react';
import { Mail, Sparkles, Plus, Copy, Check, Download, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { CoverLetterData, ResumeData } from '../../types/resume';
import { CoverLetterModal } from '../ai/CoverLetterModal';

interface Props {
  resumes: ResumeData[];
  activeResume: ResumeData | null;
}

export const CoverLetterListView: React.FC<Props> = ({ resumes, activeResume }) => {
  const [selectedResume, setSelectedResume] = useState<ResumeData>(activeResume || resumes[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedLetters, setSavedLetters] = useState<Array<{
    id: string;
    company: string;
    role: string;
    date: string;
    content: string;
  }>>([
    {
      id: 'cl-1',
      company: 'Veloce Cloud Technologies',
      role: 'Staff Software Engineer',
      date: 'Sep 24, 2026',
      content: `Dear Hiring Team,\n\nI am writing to express my strong enthusiasm for the Staff Software Engineer position at Veloce Cloud Technologies. With over 7 years of full-stack engineering experience scaling distributed cloud systems to millions of daily users, I am confident in my ability to immediately accelerate your infrastructure roadmap.\n\nThroughout my career, I have specialized in migrating monolithic systems into high-throughput microservices in Go and Node.js, achieving a 45% reduction in API response times. I look forward to discussing how my experience aligns with your team's goals.\n\nSincerely,\nAlex Vance`,
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setSavedLetters((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles size={12} />
            <span>AI Cover Letter Generator</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Tailored Cover Letters</h1>
          <p className="text-xs text-blue-200">
            Generate authentic cover letters tailored to your target company and job requirements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>New AI Cover Letter</span>
        </button>
      </div>

      {/* Select active resume selector */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Source Resume Profile:
        </span>
        <select
          value={selectedResume?.id}
          onChange={(e) => {
            const found = resumes.find(r => r.id === e.target.value);
            if (found) setSelectedResume(found);
          }}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title} ({r.personal.fullName || 'Untitled'})
            </option>
          ))}
        </select>
      </div>

      {/* Letters List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Saved Cover Letters ({savedLetters.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedLetters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {letter.company}
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">
                      {letter.role}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {letter.date}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-line">
                  {letter.content}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCopy(letter.id, letter.content)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === letter.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedId === letter.id ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => handleDelete(letter.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete cover letter"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedResume && (
        <CoverLetterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resume={selectedResume}
        />
      )}

    </div>
  );
};
