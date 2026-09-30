import React from 'react';
import { 
  Sparkles, FileText, Download, Printer, Share2, 
  RotateCcw, RotateCw, CheckCircle, Clock, Eye, 
  Layers, ShieldCheck, ChevronDown, User, ArrowLeft
} from 'lucide-react';
import { ResumeData, UserProfile } from '../../types/resume';

interface NavbarProps {
  currentView: 'dashboard' | 'editor' | 'templates' | 'cover-letter' | 'ats-scanner';
  onNavigate: (view: 'dashboard' | 'editor' | 'templates' | 'cover-letter' | 'ats-scanner') => void;
  activeResume: ResumeData | null;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  onOpenVersions?: () => void;
  onOpenAIGenerator?: () => void;
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeResume,
  saveStatus,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onDownloadPDF,
  onPrint,
  onShare,
  onOpenVersions,
  onOpenAIGenerator,
  user,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Back to Dashboard */}
        <div className="flex items-center gap-3">
          {currentView !== 'dashboard' ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Dashboard</span>
            </button>
          ) : null}

          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
                Resume<span className="text-indigo-600">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded border border-indigo-200/60">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Center: Editor Title & Autosave status OR Navigation Tabs */}
        {currentView === 'editor' && activeResume ? (
          <div className="hidden md:flex items-center gap-3">
            <span className="font-semibold text-slate-800 text-sm max-w-[200px] lg:max-w-[280px] truncate">
              {activeResume.title || 'Untitled Resume'}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 border border-slate-200">
              {saveStatus === 'saving' && (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-700">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle size={12} className="text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Saved</span>
                </>
              )}
              {saveStatus === 'unsaved' && (
                <>
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-slate-500">Unsaved edits</span>
                </>
              )}
            </div>

            {/* Undo / Redo controls */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded transition-colors cursor-pointer"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'dashboard' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Resumes
            </button>
            <button
              onClick={() => onNavigate('templates')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'templates' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Templates (10)
            </button>
            <button
              onClick={() => onNavigate('ats-scanner')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'ats-scanner' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              ATS Checker
            </button>
            <button
              onClick={() => onNavigate('cover-letter')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'cover-letter' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Cover Letters
            </button>
          </nav>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {currentView === 'editor' ? (
            <>
              {onOpenVersions && (
                <button
                  onClick={onOpenVersions}
                  title="Version History"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Layers size={14} />
                  <span>History</span>
                </button>
              )}

              {onShare && (
                <button
                  onClick={onShare}
                  title="Share Public Link"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              )}

              {onPrint && (
                <button
                  onClick={onPrint}
                  title="Print / Save as PDF via Browser"
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer size={16} />
                </button>
              )}

              {onDownloadPDF && (
                <button
                  onClick={onDownloadPDF}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:shadow cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onOpenAIGenerator}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Create with AI</span>
              </button>
            </>
          )}

          {/* User Avatar */}
          <div className="ml-1 pl-2 border-l border-slate-200 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 ring-2 ring-indigo-500/20 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-slate-700">
              {user.name}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
