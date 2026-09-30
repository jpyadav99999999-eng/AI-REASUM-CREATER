import React from 'react';
import { 
  Palette, Type, Layout, Eye, EyeOff, 
  ArrowUp, ArrowDown, Image as ImageIcon, Sparkles, Check
} from 'lucide-react';
import { ResumeData, SectionType, TemplateId } from '../../types/resume';
import { COLOR_PALETTES, TEMPLATES } from '../../data/templates';

interface Props {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const DesignPanel: React.FC<Props> = ({ resume, onChange }) => {
  const { settings } = resume;

  const updateSettings = (updates: Partial<typeof settings>) => {
    onChange({
      ...resume,
      settings: {
        ...resume.settings,
        ...updates,
      },
    });
  };

  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const list = [...settings.sectionOrder];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateSettings({ sectionOrder: list });
  };

  const toggleSectionVisibility = (sec: SectionType) => {
    const hidden = settings.hiddenSections.includes(sec);
    updateSettings({
      hiddenSections: hidden
        ? settings.hiddenSections.filter((s) => s !== sec)
        : [...settings.hiddenSections, sec],
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <h3 className="font-bold text-sm text-slate-800">Design & Customization</h3>
        <p className="text-[11px] text-slate-500">Customize templates, palettes, typography & spacing</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* 1. TEMPLATE PICKER (10 Professional Templates) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layout size={14} className="text-indigo-600" />
              <span>Resume Template ({TEMPLATES.length})</span>
            </label>
            <span className="text-[11px] font-semibold text-indigo-600">
              {TEMPLATES.find((t) => t.id === settings.template)?.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {TEMPLATES.map((tmpl) => {
              const isSelected = settings.template === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    updateSettings({
                      template: tmpl.id,
                      primaryColor: tmpl.defaultColors.primary,
                      secondaryColor: tmpl.defaultColors.secondary,
                    });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {tmpl.name}
                    </span>
                    {isSelected && (
                      <Check size={13} className="text-indigo-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mb-1.5">
                    {tmpl.category}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: tmpl.defaultColors.primary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: tmpl.defaultColors.secondary }}
                    />
                    {tmpl.badge && (
                      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. COLOR PALETTES */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
            <Palette size={14} className="text-indigo-600" />
            <span>Color Palette & Accents</span>
          </label>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {COLOR_PALETTES.map((palette, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateSettings({ primaryColor: palette.primary, secondaryColor: palette.secondary })}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 flex flex-col items-center gap-1 transition-all cursor-pointer"
                title={palette.name}
              >
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: palette.primary }} />
                  <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: palette.secondary }} />
                </div>
                <span className="text-[9px] text-slate-600 truncate w-full text-center">
                  {palette.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block mb-1">Primary Color</span>
              <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-slate-50">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                />
                <span className="font-mono text-[10px] text-slate-700">{settings.primaryColor}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-semibold block mb-1">Accent Color</span>
              <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-slate-50">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                />
                <span className="font-mono text-[10px] text-slate-700">{settings.secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TYPOGRAPHY */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
            <Type size={14} className="text-indigo-600" />
            <span>Font & Sizing</span>
          </label>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block mb-1">Font Family</span>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Inter">Inter (Clean Modern Sans)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Contemporary)</option>
                <option value="Merriweather">Merriweather (Classic Editorial Serif)</option>
                <option value="Playfair Display">Playfair Display (Executive High-End)</option>
                <option value="Fira Code">Fira Code (Tech & Developer)</option>
                <option value="Cinzel">Cinzel (Classical Stately)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['compact', 'normal', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => updateSettings({ fontSize: sz })}
                  className={`py-1.5 rounded-lg border text-xs capitalize cursor-pointer ${
                    settings.fontSize === sz
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. MARGINS & SPACING */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
            Page Margins & Density
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {(['compact', 'standard', 'spacious'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => updateSettings({ margins: m })}
                className={`py-1.5 rounded-lg border text-xs capitalize cursor-pointer ${
                  settings.margins === m
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 5. PHOTO & ICON TOGGLES */}
        <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
            <span className="font-semibold text-slate-700">Display Profile Photo</span>
            <input
              type="checkbox"
              checked={settings.showPhoto}
              onChange={(e) => updateSettings({ showPhoto: e.target.checked })}
              className="rounded text-indigo-600"
            />
          </label>
          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
            <span className="font-semibold text-slate-700">Display Section Icons</span>
            <input
              type="checkbox"
              checked={settings.showIcons}
              onChange={(e) => updateSettings({ showIcons: e.target.checked })}
              className="rounded text-indigo-600"
            />
          </label>
        </div>

        {/* 6. SECTION ORDERING & VISIBILITY */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Section Layout & Order
            </label>
          </div>

          <div className="space-y-1.5">
            {settings.sectionOrder.map((sec, idx) => {
              const isHidden = settings.hiddenSections.includes(sec);
              return (
                <div
                  key={sec}
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <span className={`capitalize font-medium ${isHidden ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {sec}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(sec)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                      title={isHidden ? 'Show section' : 'Hide section'}
                    >
                      {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === settings.sectionOrder.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
