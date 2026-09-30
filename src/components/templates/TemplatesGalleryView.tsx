import React, { useState } from 'react';
import { Layout, Check, Sparkles, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../../data/templates';
import { ResumeData, TemplateId } from '../../types/resume';

interface Props {
  activeResume: ResumeData | null;
  onApplyTemplate: (templateId: TemplateId) => void;
  onCreateWithTemplate: (templateId: TemplateId) => void;
}

export const TemplatesGalleryView: React.FC<Props> = ({
  activeResume,
  onApplyTemplate,
  onCreateWithTemplate,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'Corporate', 'Modern', 'Design & Creative', 'Leadership', 'Engineering', 'ATS Strict'];

  const filtered = filter === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Executive & ATS-Optimized Resume Templates
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Crafted by professional recruiters and design specialists. All templates are responsive, printer-ready, and calibrated for modern applicant tracking algorithms.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filter === c 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c === 'all' ? 'All 10 Templates' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => {
          const isCurrentActive = activeResume?.settings.template === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col group ${
                isCurrentActive ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}
            >
              {/* Template Header Preview */}
              <div className={`p-6 border-b border-slate-100 flex flex-col justify-between min-h-[140px] ${tmpl.previewBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-white/80 px-2 py-0.5 rounded backdrop-blur-xs">
                    {tmpl.category}
                  </span>
                  {tmpl.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                      {tmpl.badge}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tmpl.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/10" 
                      style={{ backgroundColor: tmpl.defaultColors.primary }} 
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/10" 
                      style={{ backgroundColor: tmpl.defaultColors.secondary }} 
                    />
                  </div>
                </div>
              </div>

              {/* Template Description */}
              <div className="p-5 flex-1 space-y-3 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 leading-relaxed">
                    {tmpl.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                      Best For:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {tmpl.recommendedFor}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  {activeResume ? (
                    <button
                      onClick={() => onApplyTemplate(tmpl.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCurrentActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isCurrentActive ? (
                        <>
                          <Check size={13} />
                          <span>Active on Resume</span>
                        </>
                      ) : (
                        <>
                          <span>Apply to Active Resume</span>
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  ) : null}

                  <button
                    onClick={() => onCreateWithTemplate(tmpl.id)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    Start Blank
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
