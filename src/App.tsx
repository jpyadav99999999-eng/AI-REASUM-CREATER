/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ResumeVersion, UserProfile, TemplateId } from './types/resume';
import { SAMPLE_RESUMES, BLANK_RESUME } from './data/defaultResumes';
import { Navbar } from './components/navbar/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { TemplatesGalleryView } from './components/templates/TemplatesGalleryView';
import { CoverLetterListView } from './components/coverletter/CoverLetterListView';
import { AtsScannerStandaloneView } from './components/ats/AtsScannerStandaloneView';
import { AIGeneratorModal } from './components/ai/AIGeneratorModal';
import { ResumeUploadModal } from './components/ai/ResumeUploadModal';
import { ShareModal } from './components/modals/ShareModal';
import { VersionHistoryModal } from './components/modals/VersionHistoryModal';
import { downloadResumePDF, printResume } from './utils/pdfExport';
import { saveResumeToServer, createVersionOnServer } from './services/api';
import { ResumeTemplateRenderer } from './components/templates/ResumeTemplateRenderer';

const LOCAL_STORAGE_KEY = 'resumeai_resumes_v1';
const LOCAL_STORAGE_USER_KEY = 'resumeai_user_v1';

export default function App() {
  // Resumes list state
  const [resumes, setResumes] = useState<ResumeData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved resumes, using defaults', e);
    }
    return SAMPLE_RESUMES;
  });

  // Active resume ID
  const [activeResumeId, setActiveResumeId] = useState<string>(() => {
    return resumes[0]?.id || SAMPLE_RESUMES[0].id;
  });

  // Navigation View
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'templates' | 'cover-letter' | 'ats-scanner'>('dashboard');

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr-1',
      name: 'Alex Vance',
      email: 'alex.vance@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80',
      plan: 'pro',
      createdAt: '2026-01-15',
    };
  });

  // Undo / Redo history for active resume
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  // Versions state
  const [versions, setVersions] = useState<ResumeVersion[]>([]);

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Public share view via hash
  const [publicShareResume, setPublicShareResume] = useState<ResumeData | null>(null);

  // Active resume getter
  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0] || null;

  // Initialize history when selecting resume
  useEffect(() => {
    if (activeResume) {
      setHistory([activeResume]);
      setHistoryIdx(0);
    }
  }, [activeResumeId]);

  // Check URL hash for public share
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#share=')) {
        const shareId = hash.replace('#share=', '');
        const found = resumes.find(r => r.publicShareId === shareId || r.id === shareId);
        if (found) {
          setPublicShareResume(found);
        }
      } else {
        setPublicShareResume(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [resumes]);

  // Debounced Autosave to localStorage and server
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const persistResumes = (updatedList: ResumeData[]) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
        if (activeResume) {
          await saveResumeToServer(activeResume);
        }
        setSaveStatus('saved');
      } catch (e) {
        console.error('Autosave error', e);
        setSaveStatus('unsaved');
      }
    }, 600);
  };

  // Resume Change handler with Undo/Redo recording
  const handleResumeChange = (updated: ResumeData) => {
    const timestamped: ResumeData = {
      ...updated,
      updatedAt: new Date().toISOString(),
    };

    // Update in list
    const newList = resumes.map((r) => (r.id === timestamped.id ? timestamped : r));
    setResumes(newList);
    persistResumes(newList);

    // Record undo history
    if (historyIdx >= 0) {
      const nextHistory = history.slice(0, historyIdx + 1);
      nextHistory.push(timestamped);
      // keep max 30 history states
      if (nextHistory.length > 30) nextHistory.shift();
      setHistory(nextHistory);
      setHistoryIdx(nextHistory.length - 1);
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      const targetState = history[prevIdx];
      setHistoryIdx(prevIdx);
      const newList = resumes.map((r) => (r.id === targetState.id ? targetState : r));
      setResumes(newList);
      persistResumes(newList);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      const targetState = history[nextIdx];
      setHistoryIdx(nextIdx);
      const newList = resumes.map((r) => (r.id === targetState.id ? targetState : r));
      setResumes(newList);
      persistResumes(newList);
    }
  };

  // Keyboard shortcut listener for Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Action handlers
  const handleCreateNewBlank = () => {
    const newResume: ResumeData = {
      ...BLANK_RESUME,
      id: `res-${Date.now()}`,
      title: 'Untitled Resume',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newList = [newResume, ...resumes];
    setResumes(newList);
    setActiveResumeId(newResume.id);
    persistResumes(newList);
    setCurrentView('editor');
  };

  const handleCreateWithTemplate = (tmplId: TemplateId) => {
    const newResume: ResumeData = {
      ...BLANK_RESUME,
      id: `res-${Date.now()}`,
      title: `Resume (${tmplId.toUpperCase()})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        ...BLANK_RESUME.settings,
        template: tmplId,
      },
    };
    const newList = [newResume, ...resumes];
    setResumes(newList);
    setActiveResumeId(newResume.id);
    persistResumes(newList);
    setCurrentView('editor');
  };

  const handleSelectResume = (r: ResumeData) => {
    setActiveResumeId(r.id);
    setCurrentView('editor');
  };

  const handleDuplicateResume = (r: ResumeData) => {
    const dup: ResumeData = {
      ...r,
      id: `res-${Date.now()}`,
      title: `${r.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newList = [dup, ...resumes];
    setResumes(newList);
    setActiveResumeId(dup.id);
    persistResumes(newList);
  };

  const handleDeleteResume = (id: string) => {
    const newList = resumes.filter((r) => r.id !== id);
    setResumes(newList);
    if (activeResumeId === id && newList.length > 0) {
      setActiveResumeId(newList[0].id);
    }
    persistResumes(newList);
  };

  const handleRenameResume = (id: string, newTitle: string) => {
    const newList = resumes.map((r) => (r.id === id ? { ...r, title: newTitle } : r));
    setResumes(newList);
    persistResumes(newList);
  };

  const handleApplyTemplate = (tmplId: TemplateId) => {
    if (!activeResume) return;
    handleResumeChange({
      ...activeResume,
      settings: {
        ...activeResume.settings,
        template: tmplId,
      },
    });
    setCurrentView('editor');
  };

  const handleDownloadPDF = () => {
    if (!activeResume) return;
    const safeName = (activeResume.personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_');
    downloadResumePDF('resume-canvas-content', `${safeName}_Resume.pdf`);
  };

  const handleCreateSnapshot = async (label?: string) => {
    if (!activeResume) return;
    const newVer: ResumeVersion = {
      id: `ver-${Date.now()}`,
      resumeId: activeResume.id,
      timestamp: new Date().toISOString(),
      label: label || `Snapshot ${new Date().toLocaleTimeString()}`,
      data: JSON.parse(JSON.stringify(activeResume)),
    };
    setVersions([newVer, ...versions]);
    await createVersionOnServer(activeResume.id, newVer.label, activeResume);
  };

  const handleRestoreVersion = (ver: ResumeVersion) => {
    handleResumeChange(ver.data);
  };

  // If public share mode is triggered
  if (publicShareResume) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-lg">ResumeAI Shared Profile</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => printResume()}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Print / Save PDF
            </button>
            <a
              href="/"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Create Your Own Resume
            </a>
          </div>
        </div>

        <div className="shadow-2xl rounded-lg overflow-hidden">
          <ResumeTemplateRenderer resume={publicShareResume} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeResume={activeResume}
        saveStatus={saveStatus}
        canUndo={historyIdx > 0}
        canRedo={historyIdx < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownloadPDF={handleDownloadPDF}
        onPrint={printResume}
        onShare={() => setIsShareModalOpen(true)}
        onOpenVersions={() => setIsVersionModalOpen(true)}
        onOpenAIGenerator={() => setIsAIModalOpen(true)}
        user={user}
      />

      {/* Main Views */}
      {currentView === 'dashboard' && (
        <Dashboard
          resumes={resumes}
          user={user}
          onCreateWithAI={() => setIsAIModalOpen(true)}
          onCreateManual={handleCreateNewBlank}
          onUploadResume={() => setIsUploadModalOpen(true)}
          onSelectResume={handleSelectResume}
          onDuplicateResume={handleDuplicateResume}
          onDeleteResume={handleDeleteResume}
          onRenameResume={handleRenameResume}
          onShareResume={(r) => {
            setActiveResumeId(r.id);
            setIsShareModalOpen(true);
          }}
        />
      )}

      {currentView === 'editor' && activeResume && (
        <ResumeEditor
          resume={activeResume}
          onChange={handleResumeChange}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onDownloadPDF={handleDownloadPDF}
        />
      )}

      {currentView === 'templates' && (
        <TemplatesGalleryView
          activeResume={activeResume}
          onApplyTemplate={handleApplyTemplate}
          onCreateWithTemplate={handleCreateWithTemplate}
        />
      )}

      {currentView === 'cover-letter' && (
        <CoverLetterListView
          resumes={resumes}
          activeResume={activeResume}
        />
      )}

      {currentView === 'ats-scanner' && (
        <AtsScannerStandaloneView
          resumes={resumes}
          activeResume={activeResume}
          onOpenEditor={(r) => {
            setActiveResumeId(r.id);
            setCurrentView('editor');
          }}
        />
      )}

      {/* MODALS */}
      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSuccess={(generated) => {
          const newList = [generated, ...resumes];
          setResumes(newList);
          setActiveResumeId(generated.id);
          persistResumes(newList);
          setCurrentView('editor');
        }}
      />

      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(imported) => {
          const newList = [imported, ...resumes];
          setResumes(newList);
          setActiveResumeId(imported.id);
          persistResumes(newList);
          setCurrentView('editor');
        }}
      />

      {activeResume && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          resume={activeResume}
          onTogglePublic={(isPublic) => {
            handleResumeChange({ ...activeResume, isPublic });
          }}
        />
      )}

      {activeResume && (
        <VersionHistoryModal
          isOpen={isVersionModalOpen}
          onClose={() => setIsVersionModalOpen(false)}
          versions={versions}
          currentResume={activeResume}
          onRestoreVersion={handleRestoreVersion}
          onCreateSnapshot={handleCreateSnapshot}
        />
      )}

    </div>
  );
}
