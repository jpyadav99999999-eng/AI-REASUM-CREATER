import React from 'react';
import { Layers, Clock, RotateCcw, X, Check, FileText } from 'lucide-react';
import { ResumeData, ResumeVersion } from '../../types/resume';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  versions: ResumeVersion[];
  currentResume: ResumeData;
  onRestoreVersion: (version: ResumeVersion) => void;
  onCreateSnapshot: (label?: string) => void;
}

export const VersionHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  versions,
  currentResume,
  onRestoreVersion,
  onCreateSnapshot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers size={18} className="text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">Resume Version History</h3>
              <p className="text-xs text-slate-300">Browse snapshots and restore previous revisions.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto divide-y divide-slate-100 space-y-2">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Timeline ({versions.length} versions)
            </span>
            <button
              onClick={() => onCreateSnapshot(`Manual Snapshot ${new Date().toLocaleTimeString()}`)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md transition-colors"
            >
              + Create Snapshot
            </button>
          </div>

          {versions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Clock size={28} className="mx-auto mb-2 text-slate-300" />
              No saved revisions yet. Edits are recorded automatically.
            </div>
          ) : (
            versions.map((ver, idx) => {
              const date = new Date(ver.timestamp);
              return (
                <div key={ver.id} className="pt-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <FileText size={13} className="text-slate-400" />
                      <span>{ver.label || `Revision ${versions.length - idx}`}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onRestoreVersion(ver);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Restore</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
