import React, { useState } from 'react';
import { 
  User, FileText, Briefcase, GraduationCap, Code, 
  FolderGit2, Award, Languages, Plus, Trash2, 
  Sparkles, ChevronDown, ChevronUp, GripVertical, Check
} from 'lucide-react';
import { ResumeData, SectionType, WorkExperienceItem, EducationItem, SkillItem, ProjectItem, CertificationItem, LanguageItem, AwardItem } from '../../types/resume';

interface Props {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onOpenAIAssistant: (fieldInfo: { text: string; command: string; sectionType: string; onApply: (newText: string) => void }) => void;
}

export const EditorSidebar: React.FC<Props> = ({ resume, onChange, onOpenAIAssistant }) => {
  const [activeAccordion, setActiveAccordion] = useState<SectionType | 'all'>('personal');

  const toggleAccordion = (sec: SectionType) => {
    setActiveAccordion(prev => prev === sec ? 'all' : sec);
  };

  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    onChange({
      ...resume,
      personal: {
        ...resume.personal,
        [field]: value,
      },
    });
  };

  // ----------------- WORK EXPERIENCE -----------------
  const addExperience = () => {
    const newExp: WorkExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: ['Accomplished [X], measured by [Y], by executing [Z]'],
    };
    onChange({
      ...resume,
      experience: [newExp, ...resume.experience],
    });
    setActiveAccordion('experience');
  };

  const updateExperience = (id: string, updates: Partial<WorkExperienceItem>) => {
    onChange({
      ...resume,
      experience: resume.experience.map(e => e.id === id ? { ...e, ...updates } : e),
    });
  };

  const deleteExperience = (id: string) => {
    onChange({
      ...resume,
      experience: resume.experience.filter(e => e.id !== id),
    });
  };

  const addHighlight = (expId: string) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      highlights: [...(exp.highlights || []), ''],
    });
  };

  const updateHighlight = (expId: string, idx: number, val: string) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (!exp) return;
    const newHighlights = [...exp.highlights];
    newHighlights[idx] = val;
    updateExperience(expId, { highlights: newHighlights });
  };

  const deleteHighlight = (expId: string, idx: number) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      highlights: exp.highlights.filter((_, i) => i !== idx),
    });
  };

  // ----------------- EDUCATION -----------------
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    onChange({
      ...resume,
      education: [newEdu, ...resume.education],
    });
    setActiveAccordion('education');
  };

  const updateEducation = (id: string, updates: Partial<EducationItem>) => {
    onChange({
      ...resume,
      education: resume.education.map(e => e.id === id ? { ...e, ...updates } : e),
    });
  };

  const deleteEducation = (id: string) => {
    onChange({
      ...resume,
      education: resume.education.filter(e => e.id !== id),
    });
  };

  // ----------------- SKILLS -----------------
  const addSkill = (name: string = '') => {
    if (!name.trim()) return;
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}-${Math.random()}`,
      name: name.trim(),
      level: 'Advanced',
      category: 'Technical',
    };
    onChange({
      ...resume,
      skills: [...resume.skills, newSkill],
    });
  };

  const deleteSkill = (id: string) => {
    onChange({
      ...resume,
      skills: resume.skills.filter(s => s.id !== id),
    });
  };

  // ----------------- PROJECTS -----------------
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      url: '',
    };
    onChange({
      ...resume,
      projects: [...resume.projects, newProj],
    });
    setActiveAccordion('projects');
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    onChange({
      ...resume,
      projects: resume.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    });
  };

  const deleteProject = (id: string) => {
    onChange({
      ...resume,
      projects: resume.projects.filter(p => p.id !== id),
    });
  };

  // ----------------- CERTIFICATIONS -----------------
  const addCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
    };
    onChange({
      ...resume,
      certifications: [...resume.certifications, newCert],
    });
    setActiveAccordion('certifications');
  };

  const updateCert = (id: string, updates: Partial<CertificationItem>) => {
    onChange({
      ...resume,
      certifications: resume.certifications.map(c => c.id === id ? { ...c, ...updates } : c),
    });
  };

  const deleteCert = (id: string) => {
    onChange({
      ...resume,
      certifications: resume.certifications.filter(c => c.id !== id),
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-sm text-slate-800">Content Sections</h3>
          <p className="text-[11px] text-slate-500">Edit fields or use AI to enhance phrasing</p>
        </div>
        <button
          onClick={() => setActiveAccordion('all')}
          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Expand All
        </button>
      </div>

      {/* Accordions */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        
        {/* 1. PERSONAL INFORMATION */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleAccordion('personal')}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <User size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Personal Information</span>
            </div>
            {activeAccordion === 'personal' || activeAccordion === 'all' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {(activeAccordion === 'personal' || activeAccordion === 'all') && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={resume.personal.fullName}
                    onChange={(e) => updatePersonal('fullName', e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">Job Title</label>
                  <input
                    type="text"
                    value={resume.personal.jobTitle}
                    onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={resume.personal.email}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">Phone</label>
                  <input
                    type="text"
                    value={resume.personal.phone}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">Location</label>
                  <input
                    type="text"
                    value={resume.personal.location}
                    onChange={(e) => updatePersonal('location', e.target.value)}
                    placeholder="City, State / Country"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={resume.personal.linkedin || ''}
                    onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">Portfolio Website</label>
                  <input
                    type="text"
                    value={resume.personal.website || ''}
                    onChange={(e) => updatePersonal('website', e.target.value)}
                    placeholder="https://mywebsite.dev"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">GitHub Profile</label>
                  <input
                    type="text"
                    value={resume.personal.github || ''}
                    onChange={(e) => updatePersonal('github', e.target.value)}
                    placeholder="github.com/username"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-600 mb-1 block">Profile Photo URL</label>
                <input
                  type="text"
                  value={resume.personal.photoUrl || ''}
                  onChange={(e) => updatePersonal('photoUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. PROFESSIONAL SUMMARY */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleAccordion('summary')}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Professional Summary</span>
            </div>
            {activeAccordion === 'summary' || activeAccordion === 'all' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {(activeAccordion === 'summary' || activeAccordion === 'all') && (
            <div className="p-3.5 space-y-2 bg-white text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-600">Executive Summary</span>
                <button
                  type="button"
                  onClick={() => onOpenAIAssistant({
                    text: resume.summary,
                    command: 'Make my summary more professional, impactful, and tailored to leadership',
                    sectionType: 'Summary',
                    onApply: (newText) => onChange({ ...resume, summary: newText }),
                  })}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>AI Improve</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={resume.summary}
                onChange={(e) => onChange({ ...resume, summary: e.target.value })}
                placeholder="Write a concise 3-4 sentence summary of your career achievements and core strengths..."
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* 3. WORK EXPERIENCE */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleAccordion('experience')}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Briefcase size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                Work Experience ({resume.experience?.length || 0})
              </span>
            </div>
            {activeAccordion === 'experience' || activeAccordion === 'all' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {(activeAccordion === 'experience' || activeAccordion === 'all') && (
            <div className="p-3.5 space-y-4 bg-white text-xs">
              <button
                onClick={addExperience}
                className="w-full py-1.5 rounded-lg border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Position</span>
              </button>

              {resume.experience?.map((exp, idx) => (
                <div key={exp.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">Position #{idx + 1}</span>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Delete experience entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Start (e.g. 2022-01)"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="End Date"
                        disabled={exp.current}
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        className="px-2 py-1 bg-white rounded border border-slate-300 flex-1 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-1 text-[10px] text-slate-600 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span>Current</span>
                      </label>
                    </div>
                  </div>

                  {/* Highlights Bullets */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-600">Achievement Bullets</span>
                      <button
                        onClick={() => addHighlight(exp.id)}
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    {exp.highlights?.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-1">
                        <textarea
                          rows={2}
                          value={h}
                          onChange={(e) => updateHighlight(exp.id, hIdx, e.target.value)}
                          placeholder="Accomplished [X], measured by [Y], by executing [Z]..."
                          className="flex-1 px-2 py-1 bg-white rounded border border-slate-300 text-[11px]"
                        />
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => onOpenAIAssistant({
                              text: h,
                              command: 'Rewrite this bullet point with strong action verbs and quantifiable metrics (XYZ formula)',
                              sectionType: 'Work Experience Bullet',
                              onApply: (newText) => updateHighlight(exp.id, hIdx, newText),
                            })}
                            title="AI Improve Bullet"
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                          >
                            <Sparkles size={12} />
                          </button>
                          <button
                            onClick={() => deleteHighlight(exp.id, hIdx)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. EDUCATION */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleAccordion('education')}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Education ({resume.education?.length || 0})</span>
            </div>
            {activeAccordion === 'education' || activeAccordion === 'all' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {(activeAccordion === 'education' || activeAccordion === 'all') && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <button
                onClick={addEducation}
                className="w-full py-1.5 rounded-lg border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Degree</span>
              </button>

              {resume.education?.map((edu) => (
                <div key={edu.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="School / University"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300 font-semibold flex-1 mr-2"
                    />
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Degree (e.g. B.S., M.S.)"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Dates (e.g. 2018 - 2022)"
                      value={`${edu.startDate || ''} – ${edu.endDate || ''}`.replace(/^ – $/, '')}
                      onChange={(e) => {
                        const parts = e.target.value.split('–');
                        updateEducation(edu.id, {
                          startDate: parts[0]?.trim() || '',
                          endDate: parts[1]?.trim() || '',
                        });
                      }}
                      className="px-2 py-1 bg-white rounded border border-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="GPA (optional)"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. SKILLS */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleAccordion('skills')}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Code size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Skills ({resume.skills?.length || 0})</span>
            </div>
            {activeAccordion === 'skills' || activeAccordion === 'all' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {(activeAccordion === 'skills' || activeAccordion === 'all') && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              {/* Quick skill adder */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="quick-skill-input"
                  placeholder="Type a skill (e.g. React, Python, Figma) and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('quick-skill-input') as HTMLInputElement;
                    if (el) {
                      addSkill(el.value);
                      el.value = '';
                    }
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Skills chips */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pt-1">
                {resume.skills?.map((sk) => (
                  <span
                    key={sk.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <span>{sk.name}</span>
                    <button
                      onClick={() => deleteSkill(sk.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. PROJECTS */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleAccordion('projects')}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FolderGit2 size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Key Projects ({resume.projects?.length || 0})</span>
            </div>
            {activeAccordion === 'projects' || activeAccordion === 'all' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {(activeAccordion === 'projects' || activeAccordion === 'all') && (
            <div className="p-3.5 space-y-3 bg-white text-xs">
              <button
                onClick={addProject}
                className="w-full py-1.5 rounded-lg border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Project</span>
              </button>

              {resume.projects?.map((proj) => (
                <div key={proj.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="px-2 py-1 bg-white rounded border border-slate-300 font-semibold flex-1 mr-2"
                    />
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Short description of what the project does and key outcome..."
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    className="w-full px-2 py-1 bg-white rounded border border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma separated, e.g. React, Node.js, AWS)"
                    value={proj.technologies?.join(', ') || ''}
                    onChange={(e) => updateProject(proj.id, {
                      technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })}
                    className="w-full px-2 py-1 bg-white rounded border border-slate-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. CERTIFICATIONS */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleAccordion('certifications')}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Award size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                Certifications ({resume.certifications?.length || 0})
              </span>
            </div>
            {activeAccordion === 'certifications' || activeAccordion === 'all' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {(activeAccordion === 'certifications' || activeAccordion === 'all') && (
            <div className="p-3.5 space-y-2 bg-white text-xs">
              <button
                onClick={addCert}
                className="w-full py-1.5 rounded-lg border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Certification</span>
              </button>

              {resume.certifications?.map((c) => (
                <div key={c.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder="Certification Name"
                    value={c.name}
                    onChange={(e) => updateCert(c.id, { name: e.target.value })}
                    className="flex-1 px-2 py-1 bg-white rounded border border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Issuer"
                    value={c.issuer}
                    onChange={(e) => updateCert(c.id, { issuer: e.target.value })}
                    className="w-24 px-2 py-1 bg-white rounded border border-slate-300"
                  />
                  <button
                    onClick={() => deleteCert(c.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
