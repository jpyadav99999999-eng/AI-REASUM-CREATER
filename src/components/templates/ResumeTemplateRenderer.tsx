import React from 'react';
import { ResumeData, SectionType } from '../../types/resume';
import { 
  Mail, Phone, MapPin, Globe, Linkedin, Github, 
  Award, Briefcase, GraduationCap, Code, FolderGit2, 
  Languages, HeartHandshake, CheckCircle2, ExternalLink
} from 'lucide-react';

interface Props {
  resume: ResumeData;
  scale?: number;
  previewMode?: boolean;
}

export const ResumeTemplateRenderer: React.FC<Props> = ({ resume, scale = 1, previewMode = false }) => {
  const { settings, personal } = resume;
  const {
    template = 'professional',
    primaryColor = '#1e3a8a',
    secondaryColor = '#3b82f6',
    textColor = '#1f2937',
    fontFamily = 'Inter',
    fontSize = 'normal',
    lineSpacing = 'normal',
    margins = 'standard',
    sectionSpacing = 'standard',
    showPhoto = true,
    showIcons = true,
    sectionOrder = ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'awards'],
    hiddenSections = [],
  } = settings || {};

  // Font family mapping
  const fontClass = {
    'Inter': 'font-inter',
    'Plus Jakarta Sans': 'font-jakarta',
    'Merriweather': 'font-merriweather',
    'Playfair Display': 'font-playfair',
    'Fira Code': 'font-fira',
    'Cinzel': 'font-cinzel',
  }[fontFamily] || 'font-inter';

  // Base font size
  const sizeClass = {
    compact: 'text-[11px] leading-[1.35]',
    normal: 'text-[12.5px] leading-[1.45]',
    large: 'text-[13.5px] leading-[1.55]',
  }[fontSize] || 'text-[12.5px] leading-[1.45]';

  // Margin padding
  const marginClass = {
    compact: 'p-6 md:p-8',
    standard: 'p-8 md:p-10',
    spacious: 'p-10 md:p-12',
  }[margins] || 'p-8 md:p-10';

  // Spacing between sections
  const spacingClass = {
    compact: 'space-y-3.5',
    standard: 'space-y-5',
    spacious: 'space-y-7',
  }[sectionSpacing] || 'space-y-5';

  const isVisible = (sec: SectionType) => !hiddenSections.includes(sec);

  // -------------------------------------------------------------
  // SHARED SECTION SUBCOMPONENTS
  // -------------------------------------------------------------

  const renderContactInfo = (horizontal = true, iconColor = primaryColor) => (
    <div className={`flex flex-wrap ${horizontal ? 'items-center gap-x-4 gap-y-1.5' : 'flex-col gap-1.5'} text-[0.88em] opacity-85`}>
      {personal.email && (
        <span className="inline-flex items-center gap-1.5">
          {showIcons && <Mail size={13} style={{ color: iconColor }} className="shrink-0" />}
          <span>{personal.email}</span>
        </span>
      )}
      {personal.phone && (
        <span className="inline-flex items-center gap-1.5">
          {showIcons && <Phone size={13} style={{ color: iconColor }} className="shrink-0" />}
          <span>{personal.phone}</span>
        </span>
      )}
      {personal.location && (
        <span className="inline-flex items-center gap-1.5">
          {showIcons && <MapPin size={13} style={{ color: iconColor }} className="shrink-0" />}
          <span>{personal.location}</span>
        </span>
      )}
      {personal.linkedin && (
        <span className="inline-flex items-center gap-1.5">
          {showIcons && <Linkedin size={13} style={{ color: iconColor }} className="shrink-0" />}
          <a href={personal.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
            {personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
          </a>
        </span>
      )}
      {personal.github && (
        <span className="inline-flex items-center gap-1.5">
          {showIcons && <Github size={13} style={{ color: iconColor }} className="shrink-0" />}
          <a href={personal.github} target="_blank" rel="noreferrer" className="hover:underline">
            {personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
          </a>
        </span>
      )}
      {personal.website && (
        <span className="inline-flex items-center gap-1.5">
          {showIcons && <Globe size={13} style={{ color: iconColor }} className="shrink-0" />}
          <a href={personal.website} target="_blank" rel="noreferrer" className="hover:underline">
            {personal.website.replace(/^https?:\/\//, '')}
          </a>
        </span>
      )}
    </div>
  );

  const renderSummary = (headerTitle = 'Professional Summary') => (
    resume.summary && isVisible('summary') && (
      <div>
        <SectionHeader title={headerTitle} icon={<CheckCircle2 size={15} />} />
        <p className="mt-1.5 text-[0.96em] leading-relaxed text-slate-700 whitespace-pre-line text-justify">
          {resume.summary}
        </p>
      </div>
    )
  );

  const renderExperience = (headerTitle = 'Work Experience') => (
    resume.experience?.length > 0 && isVisible('experience') && (
      <div>
        <SectionHeader title={headerTitle} icon={<Briefcase size={15} />} />
        <div className="mt-2.5 space-y-3.5">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="relative">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <div>
                  <h4 className="font-semibold text-[1.02em] text-slate-900">{exp.position}</h4>
                  <span className="font-medium text-slate-700">{exp.company}</span>
                  {exp.location && <span className="text-slate-500 text-[0.88em]"> • {exp.location}</span>}
                </div>
                <div className="text-[0.88em] font-medium text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                </div>
              </div>
              {exp.description && (
                <p className="mt-1 text-[0.93em] text-slate-600 leading-snug">{exp.description}</p>
              )}
              {exp.highlights?.length > 0 && (
                <ul className="mt-1.5 space-y-1 text-[0.93em] text-slate-700 list-disc list-outside pl-4">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-snug">{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderEducation = (headerTitle = 'Education') => (
    resume.education?.length > 0 && isVisible('education') && (
      <div>
        <SectionHeader title={headerTitle} icon={<GraduationCap size={15} />} />
        <div className="mt-2.5 space-y-2.5">
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-1">
              <div>
                <h4 className="font-semibold text-[1.0em] text-slate-900">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </h4>
                <div className="text-slate-700 text-[0.93em]">{edu.institution} {edu.location && `• ${edu.location}`}</div>
                {edu.gpa && <div className="text-slate-500 text-[0.86em] mt-0.5">GPA: {edu.gpa}</div>}
              </div>
              <div className="text-[0.86em] font-medium text-slate-500">
                {edu.startDate} – {edu.endDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderSkills = (headerTitle = 'Skills & Competencies') => (
    resume.skills?.length > 0 && isVisible('skills') && (
      <div>
        <SectionHeader title={headerTitle} icon={<Code size={15} />} />
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {resume.skills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center px-2.5 py-1 rounded text-[0.88em] font-medium bg-slate-100 text-slate-800 border border-slate-200/80"
              style={{ borderColor: `${primaryColor}25` }}
            >
              {skill.name}
              {skill.level && (
                <span className="ml-1.5 text-[0.82em] opacity-65 font-normal">({skill.level})</span>
              )}
            </span>
          ))}
        </div>
      </div>
    )
  );

  const renderProjects = (headerTitle = 'Key Projects') => (
    resume.projects?.length > 0 && isVisible('projects') && (
      <div>
        <SectionHeader title={headerTitle} icon={<FolderGit2 size={15} />} />
        <div className="mt-2.5 space-y-2.5">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="border-l-2 pl-3 py-0.5" style={{ borderColor: `${secondaryColor}80` }}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[0.98em] text-slate-900 flex items-center gap-1.5">
                  {proj.name}
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      <ExternalLink size={12} />
                    </a>
                  )}
                </h4>
              </div>
              <p className="text-[0.91em] text-slate-700 leading-snug mt-0.5">{proj.description}</p>
              {proj.technologies?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="text-[0.8em] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderCertifications = (headerTitle = 'Certifications') => (
    resume.certifications?.length > 0 && isVisible('certifications') && (
      <div>
        <SectionHeader title={headerTitle} icon={<Award size={15} />} />
        <div className="mt-2 space-y-1.5">
          {resume.certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline text-[0.92em]">
              <span className="font-medium text-slate-800">{c.name} <span className="text-slate-500 font-normal">• {c.issuer}</span></span>
              <span className="text-[0.86em] text-slate-500">{c.date}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderAwards = (headerTitle = 'Honors & Awards') => (
    resume.awards?.length > 0 && isVisible('awards') && (
      <div>
        <SectionHeader title={headerTitle} icon={<Award size={15} />} />
        <div className="mt-2 space-y-1.5">
          {resume.awards.map((a) => (
            <div key={a.id} className="text-[0.92em]">
              <div className="flex justify-between font-medium text-slate-800">
                <span>{a.title} {a.issuer && <span className="text-slate-500 font-normal">({a.issuer})</span>}</span>
                <span className="text-[0.86em] text-slate-500">{a.date}</span>
              </div>
              {a.description && <p className="text-[0.88em] text-slate-600 mt-0.5">{a.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderLanguages = (headerTitle = 'Languages') => (
    resume.languages?.length > 0 && isVisible('languages') && (
      <div>
        <SectionHeader title={headerTitle} icon={<Languages size={15} />} />
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[0.92em]">
          {resume.languages.map((l) => (
            <span key={l.id} className="text-slate-700">
              <strong className="font-semibold text-slate-800">{l.name}:</strong> <span className="text-slate-600">{l.proficiency}</span>
            </span>
          ))}
        </div>
      </div>
    )
  );

  // Section Header Component styled dynamically
  const SectionHeader = ({ title, icon }: { title: string; icon?: React.ReactNode }) => {
    switch (template) {
      case 'minimal':
        return (
          <div className="border-b border-zinc-300 pb-1 mb-2">
            <h3 className="font-semibold uppercase tracking-wider text-[0.88em] text-zinc-900">
              {title}
            </h3>
          </div>
        );
      case 'executive':
        return (
          <div className="flex items-center gap-3 border-b-2 pb-1.5 mb-2.5" style={{ borderColor: `${secondaryColor}60` }}>
            <h3 className="font-serif font-bold text-[1.1em] tracking-wide" style={{ color: primaryColor }}>
              {title}
            </h3>
          </div>
        );
      case 'tech':
        return (
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-emerald-500/30">
            <span className="font-mono text-emerald-600 font-bold">{'>'}</span>
            <h3 className="font-mono font-bold uppercase tracking-wider text-[0.92em]" style={{ color: primaryColor }}>
              {title}
            </h3>
          </div>
        );
      case 'creative':
        return (
          <div className="flex items-center gap-2 pb-1.5 mb-2 border-b-2" style={{ borderColor: primaryColor }}>
            <span style={{ color: primaryColor }}>{icon}</span>
            <h3 className="font-bold text-[1.05em] tracking-tight uppercase" style={{ color: primaryColor }}>
              {title}
            </h3>
          </div>
        );
      case 'ats':
        return (
          <div className="border-b-2 border-black pb-0.5 mb-2 mt-3">
            <h3 className="font-bold uppercase tracking-wider text-[1.0em] text-black">
              {title}
            </h3>
          </div>
        );
      case 'academic':
        return (
          <div className="border-b border-indigo-200 pb-1 mb-2">
            <h3 className="font-serif font-bold uppercase tracking-widest text-[0.95em]" style={{ color: primaryColor }}>
              {title}
            </h3>
          </div>
        );
      default:
        // Corporate / Professional default
        return (
          <div className="flex items-center gap-2 pb-1 mb-2 border-b-2" style={{ borderColor: `${primaryColor}40` }}>
            {showIcons && <span style={{ color: primaryColor }}>{icon}</span>}
            <h3 className="font-bold uppercase tracking-wider text-[0.95em]" style={{ color: primaryColor }}>
              {title}
            </h3>
          </div>
        );
    }
  };

  // -------------------------------------------------------------
  // TEMPLATE VARIANT RENDERS
  // -------------------------------------------------------------

  // 1. Creative Studio Template (Sidebar layout)
  if (template === 'creative') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-slate-800 ${fontClass} ${sizeClass} flex flex-col md:flex-row overflow-hidden relative`}
      >
        {/* Left Accent Sidebar */}
        <aside 
          className="w-full md:w-[32%] text-white p-7 flex flex-col justify-between shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <div>
            {showPhoto && personal.photoUrl && (
              <div className="mb-5 flex justify-center">
                <img 
                  src={personal.photoUrl} 
                  alt={personal.fullName} 
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shadow-md"
                />
              </div>
            )}
            <h1 className="text-[1.65em] font-extrabold tracking-tight leading-tight text-white text-center md:text-left">
              {personal.fullName || 'Your Name'}
            </h1>
            <p className="mt-1 font-medium text-[1.0em] text-white/85 text-center md:text-left">
              {personal.jobTitle || 'Professional Title'}
            </p>

            <div className="mt-6 pt-5 border-t border-white/20">
              <h4 className="text-[0.82em] font-bold uppercase tracking-wider text-white/70 mb-3">Contact</h4>
              <div className="space-y-2 text-[0.9em] text-white/90">
                {personal.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={13} className="shrink-0 text-white/70" />
                    <span className="truncate">{personal.email}</span>
                  </div>
                )}
                {personal.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="shrink-0 text-white/70" />
                    <span>{personal.phone}</span>
                  </div>
                )}
                {personal.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="shrink-0 text-white/70" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.linkedin && (
                  <div className="flex items-center gap-2 truncate">
                    <Linkedin size={13} className="shrink-0 text-white/70" />
                    <span className="truncate">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
                {personal.website && (
                  <div className="flex items-center gap-2 truncate">
                    <Globe size={13} className="shrink-0 text-white/70" />
                    <span className="truncate">{personal.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Skills */}
            {resume.skills?.length > 0 && isVisible('skills') && (
              <div className="mt-6 pt-5 border-t border-white/20">
                <h4 className="text-[0.82em] font-bold uppercase tracking-wider text-white/70 mb-3">Top Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((s) => (
                    <span key={s.id} className="text-[0.84em] bg-white/15 px-2 py-0.5 rounded text-white font-medium">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar Education */}
            {resume.education?.length > 0 && isVisible('education') && (
              <div className="mt-6 pt-5 border-t border-white/20">
                <h4 className="text-[0.82em] font-bold uppercase tracking-wider text-white/70 mb-2.5">Education</h4>
                <div className="space-y-3">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="text-[0.88em]">
                      <div className="font-semibold text-white">{edu.degree}</div>
                      <div className="text-white/80">{edu.institution}</div>
                      <div className="text-white/60 text-[0.82em]">{edu.startDate} – {edu.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className={`flex-1 ${marginClass} ${spacingClass} bg-white`}>
          {renderSummary('About Me')}
          {renderExperience()}
          {renderProjects()}
          {renderCertifications()}
          {renderAwards()}
          {renderLanguages()}
        </main>
      </div>
    );
  }

  // 2. Modern Slate Template (Dual Tone Header & Accents)
  if (template === 'modern') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-slate-800 ${fontClass} ${sizeClass} overflow-hidden`}
      >
        {/* Top Header Banner */}
        <header className="p-8 pb-6 border-b" style={{ backgroundColor: `${primaryColor}0a`, borderColor: `${primaryColor}20` }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {showPhoto && personal.photoUrl && (
                <img 
                  src={personal.photoUrl} 
                  alt={personal.fullName} 
                  className="w-18 h-18 rounded-lg object-cover shadow-sm border-2"
                  style={{ borderColor: primaryColor }}
                />
              )}
              <div>
                <h1 className="text-[1.8em] font-extrabold tracking-tight" style={{ color: primaryColor }}>
                  {personal.fullName || 'Your Name'}
                </h1>
                <p className="text-[1.1em] font-semibold text-slate-700 mt-0.5">
                  {personal.jobTitle || 'Target Position'}
                </p>
              </div>
            </div>
            <div className="text-[0.9em]">
              {renderContactInfo(false, secondaryColor)}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className={`${marginClass} ${spacingClass}`}>
          {renderSummary()}
          {renderExperience()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderEducation()}
            {renderSkills()}
          </div>
          {renderProjects()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderCertifications()}
            {renderLanguages()}
          </div>
          {renderAwards()}
        </div>
      </div>
    );
  }

  // 3. Minimalist Clean Template (Pure monochrome, whitespace-focused)
  if (template === 'minimal') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-zinc-900 ${fontClass} ${sizeClass} ${marginClass} ${spacingClass}`}
      >
        <header className="border-b-2 border-zinc-900 pb-5">
          <h1 className="text-[2.2em] font-light tracking-tight text-zinc-950 uppercase">
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="text-[1.05em] font-medium text-zinc-600 tracking-wider uppercase mt-1">
            {personal.jobTitle || 'Professional Title'}
          </p>
          <div className="mt-3 text-zinc-600">
            {renderContactInfo(true, '#18181b')}
          </div>
        </header>

        {renderSummary('Overview')}
        {renderExperience('Experience')}
        {renderEducation('Education')}
        {renderSkills('Skills & Tools')}
        {renderProjects('Projects')}
        {renderCertifications('Certifications')}
        {renderLanguages('Languages')}
        {renderAwards('Awards')}
      </div>
    );
  }

  // 4. Executive Leadership Template (Serif headings, gold/bronze trim)
  if (template === 'executive') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-slate-800 ${fontClass} ${sizeClass} ${marginClass} ${spacingClass}`}
      >
        <header className="text-center pb-6 border-b-2" style={{ borderColor: secondaryColor }}>
          {showPhoto && personal.photoUrl && (
            <div className="mb-3 flex justify-center">
              <img 
                src={personal.photoUrl} 
                alt={personal.fullName} 
                className="w-20 h-20 rounded-full object-cover border-2 shadow-sm"
                style={{ borderColor: secondaryColor }}
              />
            </div>
          )}
          <h1 className="font-serif text-[2.2em] font-bold tracking-tight text-slate-900">
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="font-serif italic text-[1.12em] font-medium text-slate-700 mt-1">
            {personal.jobTitle || 'Executive Professional'}
          </p>
          <div className="mt-3 flex justify-center">
            {renderContactInfo(true, secondaryColor)}
          </div>
        </header>

        {renderSummary('Executive Profile')}
        {renderExperience('Leadership Experience')}
        {renderEducation('Education & Credentials')}
        {renderSkills('Core Competencies')}
        {renderAwards('Honors & Board Affiliations')}
        {renderCertifications('Certifications')}
        {renderLanguages('Languages')}
      </div>
    );
  }

  // 5. Tech Specialist Template (Monospace accents, emerald tags)
  if (template === 'tech') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-zinc-800 ${fontClass} ${sizeClass} ${marginClass} ${spacingClass}`}
      >
        <header className="border-b-2 border-zinc-900 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="font-mono text-emerald-600 text-[0.82em] font-semibold">// software_engineer.profile</div>
              <h1 className="text-[1.9em] font-extrabold text-zinc-950 tracking-tight">
                {personal.fullName || 'Developer Name'}
              </h1>
              <p className="text-[1.08em] font-mono text-zinc-700 font-semibold mt-0.5">
                {personal.jobTitle || 'Full Stack Engineer'}
              </p>
            </div>
            <div className="font-mono text-[0.88em]">
              {renderContactInfo(false, '#10b981')}
            </div>
          </div>
        </header>

        {renderSummary('Technical Summary')}
        {renderSkills('Technical Stack & Tools')}
        {renderExperience('Engineering Experience')}
        {renderProjects('Open Source & Systems')}
        {renderEducation('Education')}
        {renderCertifications('Certifications')}
        {renderAwards('Achievements & Hackathons')}
      </div>
    );
  }

  // 6. ATS Strict Single Column Template (Machine-readable perfection)
  if (template === 'ats') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-none text-black ${fontClass} ${sizeClass} p-8 md:p-10 space-y-4`}
      >
        <header className="text-center border-b-2 border-black pb-3">
          <h1 className="text-[1.8em] font-bold uppercase tracking-wider text-black">
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="text-[1.05em] font-semibold text-black mt-0.5">
            {personal.jobTitle || 'Target Role'}
          </p>
          <div className="mt-2 text-[0.92em] text-black">
            {personal.location && <span>{personal.location} | </span>}
            {personal.phone && <span>{personal.phone} | </span>}
            {personal.email && <span>{personal.email}</span>}
            {personal.linkedin && <span> | {personal.linkedin}</span>}
            {personal.website && <span> | {personal.website}</span>}
          </div>
        </header>

        {renderSummary('Summary')}
        {renderExperience('Work Experience')}
        {renderEducation('Education')}
        {renderSkills('Technical & Core Skills')}
        {renderProjects('Relevant Projects')}
        {renderCertifications('Certifications')}
        {renderAwards('Awards & Recognition')}
        {renderLanguages('Languages')}
      </div>
    );
  }

  // 7. Student & Campus Template (Education & projects emphasis)
  if (template === 'student') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-slate-800 ${fontClass} ${sizeClass} ${marginClass} ${spacingClass}`}
      >
        <header className="border-b-2 pb-4 text-center" style={{ borderColor: primaryColor }}>
          <h1 className="text-[2.0em] font-extrabold tracking-tight" style={{ color: primaryColor }}>
            {personal.fullName || 'Student Name'}
          </h1>
          <p className="text-[1.08em] font-medium text-slate-700 mt-0.5">
            {personal.jobTitle || 'Candidate for Graduate Role'}
          </p>
          <div className="mt-2.5 flex justify-center">
            {renderContactInfo(true, primaryColor)}
          </div>
        </header>

        {renderSummary('Objective')}
        {renderEducation('Education & Academic Background')}
        {renderProjects('Academic & Personal Projects')}
        {renderSkills('Technical Skills & Coursework')}
        {renderExperience('Internship & Work Experience')}
        {renderCertifications('Certificates')}
        {renderAwards('Honors & Leadership')}
      </div>
    );
  }

  // 8. Academic CV Template (Scholarly, publication-centric)
  if (template === 'academic') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-slate-900 font-serif ${sizeClass} ${marginClass} ${spacingClass}`}
      >
        <header className="text-center pb-5 border-b border-indigo-900">
          <h1 className="text-[2.2em] font-bold tracking-tight text-indigo-950 uppercase">
            {personal.fullName || 'Curriculum Vitae'}
          </h1>
          <p className="text-[1.1em] italic text-indigo-900 mt-1">
            {personal.jobTitle || 'Research Fellow / Scholar'}
          </p>
          <div className="mt-2.5 flex justify-center font-sans text-[0.88em]">
            {renderContactInfo(true, '#312e81')}
          </div>
        </header>

        {renderSummary('Research Overview')}
        {renderEducation('Education')}
        {renderExperience('Academic & Research Appointments')}
        {renderProjects('Research Projects & Grants')}
        {renderAwards('Fellowships, Grants & Honors')}
        {renderSkills('Specializations & Methodologies')}
        {renderLanguages('Languages')}
      </div>
    );
  }

  // 9. Freelancer & Consultant Template (Client outcomes, outcomes showcase)
  if (template === 'freelancer') {
    return (
      <div 
        id="resume-canvas-content" 
        className={`a4-sheet bg-white shadow-2xl rounded-sm text-slate-800 ${fontClass} ${sizeClass} ${marginClass} ${spacingClass}`}
      >
        <header className="p-6 rounded-lg mb-4 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-[1.9em] font-extrabold text-white">
                {personal.fullName || 'Consultant Name'}
              </h1>
              <p className="text-[1.05em] text-teal-100 font-medium">
                {personal.jobTitle || 'Independent Specialist & Consultant'}
              </p>
            </div>
            <div className="text-[0.9em] text-teal-50">
              {renderContactInfo(false, '#a7f3d0')}
            </div>
          </div>
        </header>

        {renderSummary('Value Proposition')}
        {renderExperience('Client Contracts & Engagement History')}
        {renderProjects('Key Deliverables & Case Studies')}
        {renderSkills('Core Services & Capabilities')}
        {renderEducation('Education')}
        {renderCertifications('Accreditations')}
        {renderAwards('Client Testimonials & Recognition')}
      </div>
    );
  }

  // 10. Default: Professional Corporate Template (Clean, elegant, widely trusted)
  return (
    <div 
      id="resume-canvas-content" 
      className={`a4-sheet bg-white shadow-2xl rounded-sm text-slate-800 ${fontClass} ${sizeClass} ${marginClass} ${spacingClass}`}
    >
      {/* Header */}
      <header className="border-b-2 pb-5" style={{ borderColor: `${primaryColor}40` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {showPhoto && personal.photoUrl && (
              <img 
                src={personal.photoUrl} 
                alt={personal.fullName} 
                className="w-16 h-16 rounded-full object-cover border-2 shadow-sm shrink-0"
                style={{ borderColor: primaryColor }}
              />
            )}
            <div>
              <h1 className="text-[1.95em] font-extrabold tracking-tight" style={{ color: primaryColor }}>
                {personal.fullName || 'Your Name'}
              </h1>
              <p className="text-[1.1em] font-semibold text-slate-700 mt-0.5">
                {personal.jobTitle || 'Professional Title'}
              </p>
            </div>
          </div>
          <div className="md:text-right">
            {renderContactInfo(false, primaryColor)}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      {renderSummary()}
      {renderExperience()}
      {renderEducation()}
      {renderSkills()}
      {renderProjects()}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCertifications()}
        {renderLanguages()}
      </div>
      {renderAwards()}
    </div>
  );
};
