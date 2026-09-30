import React, { useState, useRef } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Minimize2, Sparkles, 
  Palette, ShieldCheck, Download, Printer, ArrowLeft,
  FileText, SlidersHorizontal, Check, RefreshCw
} from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { EditorSidebar } from './EditorSidebar';
import { DesignPanel } from './DesignPanel';
import { AIAssistantTab } from './AIAssistantTab';
import { AtsPanel } from './AtsPanel';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';
import { downloadResumePDF, printResume, exportResumeAsDOCX } from '../../utils/pdfExport';

interface Props {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onBackToDashboard: () => void;
  onDownloadPDF: () => void;
}

export const ResumeEditor: React.FC<Props> = ({
  resume,
  onChange,
  onBackToDashboard,
  onDownloadPDF,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rightTab, setRightTab] = useState<'design' | 'ai' | 'ats'>('design');
  const [fullScreenCanvas, setFullScreenCanvas] = useState(false);
  const [mobileTab, setMobileTab] = useState<'content' | 'preview' | 'tools'>('content');

  // For passing text directly to AI Assistant from fields
  const [aiAssistantProps, setAiAssistantProps] = useState<{
    text: string;
    command: string;
    sectionType: string;
    onApply: (newText: string) => void;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleOpenAIAssistant = (props: {
    text: string;
    command: string;
    sectionType: string;
    onApply: (newText: string) => void;
  }) => {
    setAiAssistantProps(props);
    setRightTab('ai');
    setMobileTab('tools');
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(1.4, Math.max(0.6, Number((prev + delta).toFixed(2)))));
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">
      
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-slate-200 bg-white text-xs font-semibold">
        <button
          onClick={() => setMobileTab('content')}
          className={`flex-1 py-2.5 text-center cursor-pointer ${
            mobileTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'
          }`}
        >
          1. Edit Content
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 text-center cursor-pointer ${
            mobileTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'
          }`}
        >
          2. Live Preview
        </button>
        <button
          onClick={() => setMobileTab('tools')}
          className={`flex-1 py-2.5 text-center cursor-pointer ${
            mobileTab === 'tools' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'
          }`}
        >
          3. Design & AI
        </button>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT COLUMN: Section Form Controls */}
        <aside className={`
          w-full lg:w-[360px] xl:w-[400px] shrink-0 h-full overflow-hidden z-10
          ${mobileTab === 'content' ? 'block' : 'hidden lg:block'}
        `}>
          <EditorSidebar
            resume={resume}
            onChange={onChange}
            onOpenAIAssistant={handleOpenAIAssistant}
          />
        </aside>

        {/* CENTER COLUMN: Live Interactive A4 Canvas */}
        <main className={`
          flex-1 h-full overflow-auto flex flex-col items-center bg-slate-200/70 p-4 sm:p-6 lg:p-8 relative
          ${mobileTab === 'preview' ? 'block' : 'hidden lg:flex'}
        `}>
          
          {/* Floating Canvas Controls Toolbar */}
          <div className="no-print sticky top-0 z-20 mb-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-300 shadow-md flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
              <button
                onClick={() => handleZoom(-0.1)}
                title="Zoom Out"
                className="p-1 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
              >
                <ZoomOut size={15} />
              </button>
              <span className="font-mono text-[11px] w-10 text-center font-semibold text-slate-700">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.1)}
                title="Zoom In"
                className="p-1 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-slate-800 rounded"
              >
                Reset
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-[11px]">
              <span>Template:</span>
              <strong className="text-slate-800 capitalize">{resume.settings.template}</strong>
            </div>

            <div className="border-l border-slate-200 pl-2 flex items-center gap-1">
              <button
                onClick={() => exportResumeAsDOCX(resume)}
                className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                title="Download formatted DOCX"
              >
                DOCX
              </button>
              <button
                onClick={printResume}
                className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                title="Print / Native Browser PDF"
              >
                Print
              </button>
            </div>
          </div>

          {/* Canvas Wrapper scaling with proper A4 Sheet dimensions */}
          <div 
            id="resume-canvas-container"
            className="transition-transform duration-150 origin-top flex justify-center pb-12"
            style={{ transform: `scale(${zoom})` }}
          >
            <ResumeTemplateRenderer resume={resume} />
          </div>

        </main>

        {/* RIGHT COLUMN: Design, AI Assistant & ATS Panels */}
        <aside className={`
          w-full lg:w-[350px] xl:w-[380px] shrink-0 h-full overflow-hidden flex flex-col z-10 bg-white
          ${mobileTab === 'tools' ? 'block' : 'hidden lg:flex'}
        `}>
          
          {/* Right Panel Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
            <button
              onClick={() => setRightTab('design')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                rightTab === 'design' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette size={13} />
              <span>Design</span>
            </button>
            <button
              onClick={() => setRightTab('ai')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                rightTab === 'ai' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={13} />
              <span>AI Editor</span>
            </button>
            <button
              onClick={() => setRightTab('ats')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                rightTab === 'ats' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={13} />
              <span>ATS ({resume.atsScore || 85})</span>
            </button>
          </div>

          {/* Tab Views */}
          <div className="flex-1 overflow-hidden">
            {rightTab === 'design' && (
              <DesignPanel resume={resume} onChange={onChange} />
            )}
            {rightTab === 'ai' && (
              <AIAssistantTab
                resume={resume}
                incomingText={aiAssistantProps?.text}
                incomingCommand={aiAssistantProps?.command}
                incomingSection={aiAssistantProps?.sectionType}
                onApplyIncoming={aiAssistantProps?.onApply}
              />
            )}
            {rightTab === 'ats' && (
              <AtsPanel resume={resume} onApplyImprovement={onChange} />
            )}
          </div>

        </aside>

      </div>
    </div>
  );
};
