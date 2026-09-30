import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X, RotateCcw, Loader2, Wand2 } from 'lucide-react';
import { improveTextWithAI } from '../../services/api';
import { ResumeData } from '../../types/resume';

interface Props {
  resume: ResumeData;
  onApplyImprovement?: (field: string, newText: string) => void;
  incomingText?: string;
  incomingCommand?: string;
  incomingSection?: string;
  onApplyIncoming?: (newText: string) => void;
}

const QUICK_COMMANDS = [
  'Make my summary more professional',
  'Make this experience section shorter & concise',
  'Rewrite bullet point with strong action verbs & metrics',
  'Make this ATS-friendly with keywords',
  'Fix grammar, tone and phrasing',
  'Highlight leadership, initiative and ownership',
];

export const AIAssistantTab: React.FC<Props> = ({
  resume,
  incomingText = '',
  incomingCommand = '',
  incomingSection = 'Summary',
  onApplyIncoming,
}) => {
  const [targetText, setTargetText] = useState(incomingText || resume.summary || '');
  const [selectedCommand, setSelectedCommand] = useState(incomingCommand || QUICK_COMMANDS[0]);
  const [customCommand, setCustomCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [diffResult, setDiffResult] = useState<{ before: string; after: string; explanation: string } | null>(null);

  React.useEffect(() => {
    if (incomingText) {
      setTargetText(incomingText);
    }
    if (incomingCommand) {
      setSelectedCommand(incomingCommand);
    }
  }, [incomingText, incomingCommand]);

  const handleRunImprovement = async () => {
    if (!targetText.trim()) return;

    setLoading(true);
    try {
      const cmd = customCommand.trim() || selectedCommand;
      const res = await improveTextWithAI(targetText, cmd, incomingSection, resume.targetJobTitle);
      setDiffResult({
        before: targetText,
        after: res.after,
        explanation: res.explanation,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to improve text');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (!diffResult) return;
    if (onApplyIncoming) {
      onApplyIncoming(diffResult.after);
    }
    setTargetText(diffResult.after);
    setDiffResult(null);
  };

  const handleReject = () => {
    setDiffResult(null);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles size={14} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">AI Resume Editor</h3>
            <p className="text-[11px] text-slate-500">Elevate tone, action verbs, and ATS impact</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Source Text Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Selected Content ({incomingSection})
            </label>
            <button
              onClick={() => setTargetText(resume.summary)}
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Use Summary
            </button>
          </div>
          <textarea
            rows={4}
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            placeholder="Paste text here or select an 'AI Improve' button next to any resume field..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
          />
        </div>

        {/* Quick Command Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
            Action Command
          </label>
          <div className="space-y-1.5">
            {QUICK_COMMANDS.map((cmd, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedCommand(cmd);
                  setCustomCommand('');
                }}
                className={`w-full text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedCommand === cmd && !customCommand
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cmd}
              </button>
            ))}
          </div>

          <div className="mt-2">
            <input
              type="text"
              placeholder="Or write custom instructions (e.g. 'Emphasize cloud cost savings')..."
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunImprovement}
          disabled={loading || !targetText.trim()}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Analyzing & Rewriting...</span>
            </>
          ) : (
            <>
              <Wand2 size={14} />
              <span>Improve with AI</span>
            </>
          )}
        </button>

        {/* BEFORE -> AFTER DIFF CARD */}
        {diffResult && (
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Review AI Changes
              </span>
              <span className="text-[10px] text-indigo-700 font-medium">Before → After</span>
            </div>

            {/* Before */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase">Original (Before):</span>
              <div className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-lg text-xs text-rose-900 line-through opacity-80 leading-relaxed">
                {diffResult.before}
              </div>
            </div>

            {/* After */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Improved (After):</span>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 font-medium leading-relaxed">
                {diffResult.after}
              </div>
            </div>

            {diffResult.explanation && (
              <p className="text-[11px] text-indigo-800 italic">
                💡 {diffResult.explanation}
              </p>
            )}

            {/* Accept / Reject / Regenerate buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-indigo-100">
              <button
                onClick={handleAccept}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <Check size={13} />
                <span>Accept</span>
              </button>

              <button
                onClick={handleReject}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <X size={13} />
                <span>Reject</span>
              </button>

              <button
                onClick={handleRunImprovement}
                className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                title="Regenerate"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
