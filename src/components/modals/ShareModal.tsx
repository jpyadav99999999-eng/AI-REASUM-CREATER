import React, { useState } from 'react';
import { Share2, Copy, Check, Globe, Lock, X, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../types/resume';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onTogglePublic: (isPublic: boolean) => void;
}

export const ShareModal: React.FC<Props> = ({ isOpen, onClose, resume, onTogglePublic }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const shareId = resume.publicShareId || resume.id;
  const shareUrl = `${window.location.origin}/#share=${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Share2 size={18} className="text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">Share Public Resume</h3>
              <p className="text-xs text-slate-300">Generate a live, responsive web link for recruiters.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Public Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              {resume.isPublic ? (
                <Globe size={18} className="text-emerald-600" />
              ) : (
                <Lock size={18} className="text-slate-500" />
              )}
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {resume.isPublic ? 'Public Sharing is ON' : 'Private (Disabled)'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {resume.isPublic ? 'Anyone with the link can view your resume' : 'Only you can view and edit'}
                </div>
              </div>
            </div>

            <button
              onClick={() => onTogglePublic(!resume.isPublic)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                resume.isPublic ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  resume.isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {resume.isPublic ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Shareable Web Link
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2">
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-semibold"
                >
                  <span>Open live link in new tab</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-2">
              Turn on public sharing to generate a recruiter-ready link.
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
