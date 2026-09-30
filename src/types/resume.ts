export type TemplateId = 
  | 'professional'
  | 'modern'
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'tech'
  | 'student'
  | 'ats'
  | 'academic'
  | 'freelancer';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: 'Technical' | 'Soft Skills' | 'Tools & Frameworks' | 'Other';
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export type SectionType = 
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer';

export interface ResumeSettings {
  template: TemplateId;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Merriweather' | 'Playfair Display' | 'Fira Code' | 'Cinzel';
  fontSize: 'compact' | 'normal' | 'large';
  lineSpacing: 'tight' | 'normal' | 'relaxed';
  sectionSpacing: 'compact' | 'standard' | 'spacious';
  margins: 'compact' | 'standard' | 'spacious'; // 15mm, 20mm, 25mm
  showPhoto: boolean;
  showIcons: boolean;
  sectionOrder: SectionType[];
  hiddenSections: SectionType[];
}

export interface ResumeData {
  id: string;
  title: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  targetJobTitle?: string;
  targetJobDescription?: string;
  atsScore?: number;
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  awards: AwardItem[];
  volunteer: VolunteerItem[];
  settings: ResumeSettings;
  isPublic?: boolean;
  publicShareId?: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  timestamp: string;
  label: string;
  data: ResumeData;
}

export interface AtsAnalysisResult {
  score: number;
  grade: 'Needs Work' | 'Fair' | 'Good' | 'Excellent';
  summary: string;
  keywordMatches: string[];
  missingKeywords: string[];
  formattingIssues: { issue: string; severity: 'low' | 'medium' | 'high'; fix: string }[];
  sectionCompleteness: { section: string; status: 'complete' | 'missing' | 'short'; message: string }[];
  actionVerbsScore: { score: number; found: string[]; suggestions: string[] };
  recommendations: string[];
}

export interface JobOptimizationResult {
  matchPercentage: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  bulletSuggestions: {
    originalBullet: string;
    improvedBullet: string;
    reason: string;
  }[];
  experienceGaps: string[];
}

export interface CoverLetterData {
  id: string;
  resumeId?: string;
  recipientName: string;
  recipientTitle?: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  content: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro';
  createdAt: string;
}
