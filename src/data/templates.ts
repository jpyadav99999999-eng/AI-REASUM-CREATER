import { TemplateId } from '../types/resume';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  recommendedFor: string;
  defaultColors: {
    primary: string;
    secondary: string;
  };
  previewBg: string;
  badge?: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'professional',
    name: 'Professional',
    category: 'Corporate',
    description: 'Clean, structured corporate layout with elegant divider rules and high readability.',
    recommendedFor: 'Management, Business Analysts, Finance, Corporate Roles',
    defaultColors: {
      primary: '#1e3a8a', // Deep Blue
      secondary: '#3b82f6',
    },
    previewBg: 'bg-blue-50 border-blue-200',
    badge: 'Popular',
  },
  {
    id: 'modern',
    name: 'Modern Slate',
    category: 'Modern',
    description: 'Contemporary dual-tone styling with subtle skill chips and crisp header accents.',
    recommendedFor: 'Product Managers, Marketers, Consultants',
    defaultColors: {
      primary: '#0f172a', // Slate 900
      secondary: '#0284c7', // Sky 600
    },
    previewBg: 'bg-slate-100 border-slate-300',
    badge: 'Trending',
  },
  {
    id: 'minimal',
    name: 'Minimalist Clean',
    category: 'Minimal',
    description: 'Stripped-back monochrome beauty focusing strictly on typography and whitespace.',
    recommendedFor: 'Writers, Executives, General Professionals',
    defaultColors: {
      primary: '#18181b', // Zinc 900
      secondary: '#52525b', // Zinc 600
    },
    previewBg: 'bg-zinc-50 border-zinc-200',
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    category: 'Design & Creative',
    description: 'Vibrant sidebar layout with expressive typography and visual skill highlights.',
    recommendedFor: 'UI/UX Designers, Art Directors, Content Creators, Video Editors',
    defaultColors: {
      primary: '#7c3aed', // Purple 600
      secondary: '#ec4899', // Pink 500
    },
    previewBg: 'bg-purple-50 border-purple-200',
    badge: 'Designer Pick',
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Leadership',
    description: 'Authoritative serif headings, refined gold/bronze trim, and executive summary focal point.',
    recommendedFor: 'Directors, VPs, C-Suite, Senior Executives',
    defaultColors: {
      primary: '#1e293b', // Slate 800
      secondary: '#b45309', // Amber 700
    },
    previewBg: 'bg-amber-50/50 border-amber-200',
    badge: 'Executive',
  },
  {
    id: 'tech',
    name: 'Tech Specialist',
    category: 'Engineering',
    description: 'Monospace code badges, GitHub/live links, and technology stack grouped tags.',
    recommendedFor: 'Software Engineers, DevOps, Data Scientists, Cloud Architects',
    defaultColors: {
      primary: '#09090b', // Neutral 950
      secondary: '#10b981', // Emerald 500
    },
    previewBg: 'bg-emerald-50/40 border-emerald-200',
    badge: 'Dev Favorite',
  },
  {
    id: 'student',
    name: 'Campus & Graduate',
    category: 'Entry Level',
    description: 'Education-first structure with emphasis on coursework, projects, and campus leadership.',
    recommendedFor: 'Recent Grads, Students, Internships, Career Switchers',
    defaultColors: {
      primary: '#0369a1', // Sky 700
      secondary: '#0ea5e9', // Sky 500
    },
    previewBg: 'bg-sky-50 border-sky-200',
  },
  {
    id: 'ats',
    name: 'ATS Optimized Single-Column',
    category: 'ATS Strict',
    description: '100% linear single-column structure designed for frictionless machine parsing.',
    recommendedFor: 'High-Volume Enterprise ATS, Government, Fortune 500',
    defaultColors: {
      primary: '#111827', // Gray 900
      secondary: '#374151', // Gray 700
    },
    previewBg: 'bg-gray-100 border-gray-300',
    badge: 'Highest ATS Pass',
  },
  {
    id: 'academic',
    name: 'Academic Curriculum Vitae',
    category: 'Academic & Research',
    description: 'Comprehensive scholarly format with sections for publications, honors, and research.',
    recommendedFor: 'Professors, Researchers, PhD Candidates, Medical Doctors',
    defaultColors: {
      primary: '#312e81', // Indigo 900
      secondary: '#4338ca', // Indigo 700
    },
    previewBg: 'bg-indigo-50 border-indigo-200',
  },
  {
    id: 'freelancer',
    name: 'Freelancer & Consultant',
    category: 'Contract & Freelance',
    description: 'Client outcomes, project deliverable highlights, and portfolio link callouts.',
    recommendedFor: 'Freelancers, Contractors, Independent Consultants, Agencies',
    defaultColors: {
      primary: '#0f766e', // Teal 700
      secondary: '#14b8a6', // Teal 500
    },
    previewBg: 'bg-teal-50 border-teal-200',
  },
];

export const COLOR_PALETTES = [
  { name: 'Corporate Navy', primary: '#1e3a8a', secondary: '#3b82f6' },
  { name: 'Executive Slate', primary: '#0f172a', secondary: '#475569' },
  { name: 'Emerald Tech', primary: '#064e3b', secondary: '#10b981' },
  { name: 'Modern Violet', primary: '#581c87', secondary: '#8b5cf6' },
  { name: 'Burgundy Crimson', primary: '#881337', secondary: '#e11d48' },
  { name: 'Teal Coast', primary: '#134e4a', secondary: '#0d9488' },
  { name: 'Pure Monochrome', primary: '#18181b', secondary: '#71717a' },
  { name: 'Amber Gold', primary: '#78350f', secondary: '#d97706' },
];
