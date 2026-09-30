import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory data store for resumes & versions
interface StoredResume {
  id: string;
  data: any;
  updatedAt: string;
}

interface StoredVersion {
  id: string;
  resumeId: string;
  timestamp: string;
  label: string;
  data: any;
}

let resumesStore: Map<string, StoredResume> = new Map();
let versionsStore: Map<string, StoredVersion[]> = new Map();

// Helper to sanitize Gemini JSON responses
function parseGeminiJson<T>(rawText: string, fallback: T): T {
  try {
    let clean = rawText.trim();
    // remove markdown fences if present
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    }
    return JSON.parse(clean);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', err, rawText);
    return fallback;
  }
}

// -------------------------------------------------------------
// AI ENDPOINTS
// -------------------------------------------------------------

// 1. Generate Resume from prompt
app.post('/api/ai/generate-resume', async (req, res) => {
  try {
    const { prompt, targetJobTitle, targetExperienceLevel } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemInstruction = `You are a world-class professional executive resume writer and ATS optimization specialist.
Convert the user's natural language input into a complete, modern, structured resume in JSON.

STRICT FACTUAL INTEGRITY RULES:
1. NEVER fabricate or invent employment history, companies, degrees, dates, certifications, awards, or fake job titles.
2. If the user mentions real companies, projects, or skills, represent them faithfully with strong, executive-level action verbs (e.g., Spearheaded, Architected, Formulated, Streamlined, Orchestrated, Optimized).
3. If specific details (like specific company names, dates, contact details) are not provided by the user, provide clean, realistic standard placeholders like "[Target Company]", "2022 - Present", "[Your City, State]", "[your.email@example.com]" so the user knows what to fill.
4. Craft a compelling 3-4 sentence professional summary tailored to their stated experience.
5. Provide 3-5 high-impact bullet points for experience entries using the XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".
6. Categorize skills appropriately into Technical, Tools & Frameworks, and Soft Skills.

Return strictly valid JSON with this structure:
{
  "title": string,
  "targetJobTitle": string,
  "personal": {
    "fullName": string,
    "jobTitle": string,
    "email": string,
    "phone": string,
    "location": string,
    "website": string,
    "linkedin": string,
    "github": string
  },
  "summary": string,
  "experience": [
    {
      "id": string,
      "company": string,
      "position": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "description": string,
      "highlights": [string]
    }
  ],
  "education": [
    {
      "id": string,
      "institution": string,
      "degree": string,
      "fieldOfStudy": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "gpa": string,
      "description": string
    }
  ],
  "skills": [
    {
      "id": string,
      "name": string,
      "level": "Beginner" | "Intermediate" | "Advanced" | "Expert",
      "category": "Technical" | "Tools & Frameworks" | "Soft Skills"
    }
  ],
  "projects": [
    {
      "id": string,
      "name": string,
      "description": string,
      "technologies": [string],
      "url": string
    }
  ],
  "certifications": [
    {
      "id": string,
      "name": string,
      "issuer": string,
      "date": string
    }
  ],
  "languages": [
    {
      "id": string,
      "name": string,
      "proficiency": "Native" | "Fluent" | "Proficient" | "Intermediate"
    }
  ],
  "awards": [
    {
      "id": string,
      "title": string,
      "issuer": string,
      "date": string,
      "description": string
    }
  ],
  "suggestedTemplate": "professional" | "modern" | "tech" | "creative" | "executive" | "minimal" | "ats"
}`;

    const userMessage = `User Input:
${prompt}
${targetJobTitle ? `Target Job Title: ${targetJobTitle}` : ''}
${targetExperienceLevel ? `Target Experience Level: ${targetExperienceLevel}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed: any = parseGeminiJson<any>(response.text || '{}', null);
    if (!parsed) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    // Attach unique IDs if missing
    if (Array.isArray(parsed.experience)) {
      parsed.experience = parsed.experience.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `exp-gen-${idx + 1}`,
      }));
    }
    if (Array.isArray(parsed.education)) {
      parsed.education = parsed.education.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `edu-gen-${idx + 1}`,
      }));
    }
    if (Array.isArray(parsed.skills)) {
      parsed.skills = parsed.skills.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `sk-gen-${idx + 1}`,
      }));
    }
    if (Array.isArray(parsed.projects)) {
      parsed.projects = parsed.projects.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `proj-gen-${idx + 1}`,
      }));
    }

    return res.json({ resume: parsed });
  } catch (error: any) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 2. AI In-Editor Text Assistant (Rewrite, Professional, Action Verbs, ATS, Concise)
app.post('/api/ai/improve-text', async (req, res) => {
  try {
    const { text, command, sectionType, context } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text to improve is required' });
    }

    const systemInstruction = `You are an elite career advisor and resume editor.
Improve the user's resume text based strictly on their requested command.
Never fabricate false credentials or employment records. Preserve the factual truth of what the user achieved, but elevate the phrasing, syntax, action verbs, and quantifiable impact.

Return valid JSON:
{
  "before": string (the original text),
  "after": string (the rewritten, improved text),
  "explanation": string (brief explanation of what was improved: e.g. "Replaced passive verbs with strong leadership action verbs and tightened word economy."),
  "suggestions": [string] (1-2 tips or follow-up recommendations for the user)
}`;

    const prompt = `Command: ${command || 'Make more professional and impactful'}
Section: ${sectionType || 'Resume Content'}
${context ? `Context / Job Title: ${context}` : ''}
Original Text:
"${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const result = parseGeminiJson(response.text || '{}', {
      before: text,
      after: text,
      explanation: 'Could not process rewrite',
      suggestions: [],
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error improving text:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 3. ATS Resume Scanner & Keyword Analysis
app.post('/api/ai/ats-scan', async (req, res) => {
  try {
    const { resume, targetJobTitle, jobDescription } = req.body;

    if (!resume) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const systemInstruction = `You are an expert Applicant Tracking System (ATS) auditor and corporate recruiter.
Perform a rigorous ATS analysis of the provided resume data, optionally tailored to the target job title and job description.

Evaluate:
1. ATS Score (0 - 100 based on standard recruiter ATS parsers). Do not guarantee hiring.
2. Keyword matching and identified missing high-value industry keywords.
3. Formatting pitfalls (e.g. multi-column layout risks, missing dates, headers).
4. Section completeness (Summary, Work Experience, Education, Technical Skills).
5. Action verb strength (active vs passive voice, impact verbs).
6. Actionable recommendations to increase ATS pass rate.

Return strictly valid JSON:
{
  "score": number (0-100),
  "grade": "Needs Work" | "Fair" | "Good" | "Excellent",
  "summary": string,
  "keywordMatches": [string],
  "missingKeywords": [string],
  "formattingIssues": [
    {
      "issue": string,
      "severity": "low" | "medium" | "high",
      "fix": string
    }
  ],
  "sectionCompleteness": [
    {
      "section": string,
      "status": "complete" | "missing" | "short",
      "message": string
    }
  ],
  "actionVerbsScore": {
    "score": number (0-100),
    "found": [string],
    "suggestions": [string]
  },
  "recommendations": [string]
}`;

    const prompt = `Target Job Title: ${targetJobTitle || resume.targetJobTitle || 'Not specified'}
Target Job Description:
${jobDescription || resume.targetJobDescription || 'General industry standard'}

Resume Data:
${JSON.stringify({
  personal: resume.personal,
  summary: resume.summary,
  experience: resume.experience,
  education: resume.education,
  skills: resume.skills,
  projects: resume.projects,
  certifications: resume.certifications,
})}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = parseGeminiJson(response.text || '{}', {
      score: 75,
      grade: 'Fair',
      summary: 'Analysis completed.',
      keywordMatches: ['Leadership', 'Problem Solving'],
      missingKeywords: ['System Design', 'Agile Methodologies'],
      formattingIssues: [],
      sectionCompleteness: [],
      actionVerbsScore: { score: 70, found: [], suggestions: [] },
      recommendations: ['Add more quantifiable metrics to your work experience bullets.'],
    });

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in ATS scan:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 4. Job Description Optimizer (Compare Resume vs JD)
app.post('/api/ai/job-optimize', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const systemInstruction = `You are a specialized career strategist.
Compare the user's resume against the provided Job Description.
Identify direct keyword alignments, missing qualifications, and recommend specific bullet point rewrites to match the target job's tone and requirements WITHOUT falsely claiming non-existent experience.

Return strictly valid JSON:
{
  "matchPercentage": number (0-100),
  "summary": string,
  "matchingSkills": [string],
  "missingSkills": [string],
  "bulletSuggestions": [
    {
      "originalBullet": string,
      "improvedBullet": string,
      "reason": string
    }
  ],
  "experienceGaps": [string]
}`;

    const prompt = `Target Job Description:
${jobDescription}

User Resume:
${JSON.stringify({
  title: resume.title,
  summary: resume.summary,
  experience: resume.experience?.map((e: any) => ({
    company: e.company,
    position: e.position,
    highlights: e.highlights,
  })),
  skills: resume.skills?.map((s: any) => s.name),
})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = parseGeminiJson(response.text || '{}', {
      matchPercentage: 70,
      summary: 'Analysis complete',
      matchingSkills: [],
      missingSkills: [],
      bulletSuggestions: [],
      experienceGaps: [],
    });

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error optimizing for job:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 5. AI Cover Letter Generator
app.post('/api/ai/generate-cover-letter', async (req, res) => {
  try {
    const { resume, companyName, jobTitle, jobDescription, tone } = req.body;

    if (!companyName || !jobTitle) {
      return res.status(400).json({ error: 'Company name and job title are required' });
    }

    const systemInstruction = `You are an executive career advisor.
Generate a tailored, persuasive, and authentic cover letter based on the user's real resume experience and the target position.
Do not fabricate experience. Connect their proven accomplishments to the company's prospective needs.

Return strictly valid JSON:
{
  "recipientName": string (e.g. "Hiring Manager" or named person),
  "companyName": string,
  "jobTitle": string,
  "content": string (4 structured paragraphs: Strong opening hook, 2 impact paragraphs detailing tangible achievements, confident closing with call to action),
  "keySellingPoints": [string]
}`;

    const prompt = `Company: ${companyName}
Role: ${jobTitle}
Tone: ${tone || 'Professional, Confident, and Enthusiastic'}
${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Candidate Profile:
Name: ${resume?.personal?.fullName || 'Candidate'}
Summary: ${resume?.summary || ''}
Key Experience: ${JSON.stringify(
      (resume?.experience || []).slice(0, 3).map((e: any) => ({
        company: e.company,
        role: e.position,
        highlights: e.highlights?.slice(0, 3),
      }))
    )}
Top Skills: ${(resume?.skills || []).map((s: any) => s.name).join(', ')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const parsed = parseGeminiJson(response.text || '{}', {
      recipientName: 'Hiring Team',
      companyName,
      jobTitle,
      content: `Dear Hiring Team,\n\nI am writing to express my strong enthusiasm for the ${jobTitle} position at ${companyName}.`,
      keySellingPoints: [],
    });

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 6. Parse unstructured resume text into structured ResumeData
app.post('/api/ai/parse-resume-text', async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide at least 20 characters of resume text' });
    }

    const systemInstruction = `You are a resume parsing engine.
Convert the provided raw resume text into a structured JSON resume format.
Do NOT fabricate dates or companies. Accurately extract all contact info, summary, work history, education, skills, projects, and certifications.

Return strictly valid JSON matching:
{
  "title": string,
  "personal": {
    "fullName": string,
    "jobTitle": string,
    "email": string,
    "phone": string,
    "location": string,
    "website": string,
    "linkedin": string,
    "github": string
  },
  "summary": string,
  "experience": [
    {
      "id": string,
      "company": string,
      "position": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "description": string,
      "highlights": [string]
    }
  ],
  "education": [
    {
      "id": string,
      "institution": string,
      "degree": string,
      "fieldOfStudy": string,
      "startDate": string,
      "endDate": string,
      "gpa": string
    }
  ],
  "skills": [
    {
      "id": string,
      "name": string,
      "level": "Intermediate" | "Advanced" | "Expert",
      "category": "Technical" | "Tools & Frameworks" | "Soft Skills"
    }
  ],
  "certifications": [
    {
      "id": string,
      "name": string,
      "issuer": string,
      "date": string
    }
  ],
  "languages": [
    {
      "id": string,
      "name": string,
      "proficiency": "Native" | "Fluent" | "Proficient"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: rawText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = parseGeminiJson(response.text || '{}', null);
    if (!parsed) {
      return res.status(500).json({ error: 'Could not extract resume from text' });
    }

    return res.json({ resume: parsed });
  } catch (error: any) {
    console.error('Error parsing resume text:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// -------------------------------------------------------------
// RESUME CRUD & VERSIONING ENDPOINTS
// -------------------------------------------------------------

app.get('/api/resumes', (req, res) => {
  const resumes = Array.from(resumesStore.values()).map(r => r.data);
  res.json({ resumes });
});

app.get('/api/resumes/:id', (req, res) => {
  const item = resumesStore.get(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  res.json({ resume: item.data });
});

app.post('/api/resumes', (req, res) => {
  const resume = req.body;
  if (!resume || !resume.id) {
    return res.status(400).json({ error: 'Invalid resume payload' });
  }
  resumesStore.set(resume.id, {
    id: resume.id,
    data: resume,
    updatedAt: new Date().toISOString(),
  });
  res.json({ success: true, resume });
});

app.put('/api/resumes/:id', (req, res) => {
  const id = req.params.id;
  const resume = req.body;
  resumesStore.set(id, {
    id,
    data: { ...resume, updatedAt: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  });
  res.json({ success: true, resume: resumesStore.get(id)?.data });
});

app.delete('/api/resumes/:id', (req, res) => {
  const id = req.params.id;
  resumesStore.delete(id);
  versionsStore.delete(id);
  res.json({ success: true });
});

// Resume versions
app.get('/api/resumes/:id/versions', (req, res) => {
  const versions = versionsStore.get(req.params.id) || [];
  res.json({ versions });
});

app.post('/api/resumes/:id/versions', (req, res) => {
  const id = req.params.id;
  const { label, data } = req.body;
  const version: StoredVersion = {
    id: `ver-${Date.now()}`,
    resumeId: id,
    timestamp: new Date().toISOString(),
    label: label || `Version ${new Date().toLocaleTimeString()}`,
    data,
  };
  const list = versionsStore.get(id) || [];
  list.unshift(version);
  // Keep last 15 versions
  if (list.length > 15) list.pop();
  versionsStore.set(id, list);
  res.json({ success: true, version });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    resumesCount: resumesStore.size,
  });
});

// -------------------------------------------------------------
// VITE INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumeAI Server running on port ${PORT}`);
  });
}

startServer();
