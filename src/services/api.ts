import { AtsAnalysisResult, CoverLetterData, JobOptimizationResult, ResumeData, ResumeVersion } from '../types/resume';

export async function generateResumeWithAI(prompt: string, targetJobTitle?: string): Promise<Partial<ResumeData>> {
  const res = await fetch('/api/ai/generate-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, targetJobTitle }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate resume');
  }
  const data = await res.json();
  return data.resume;
}

export async function improveTextWithAI(
  text: string,
  command: string,
  sectionType?: string,
  context?: string
): Promise<{ before: string; after: string; explanation: string; suggestions?: string[] }> {
  const res = await fetch('/api/ai/improve-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, command, sectionType, context }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to improve text');
  }
  return await res.json();
}

export async function scanResumeATS(
  resume: ResumeData,
  targetJobTitle?: string,
  jobDescription?: string
): Promise<AtsAnalysisResult> {
  const res = await fetch('/api/ai/ats-scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, targetJobTitle, jobDescription }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to scan resume');
  }
  return await res.json();
}

export async function optimizeForJobWithAI(
  resume: ResumeData,
  jobDescription: string
): Promise<JobOptimizationResult> {
  const res = await fetch('/api/ai/job-optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDescription }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to optimize resume for job');
  }
  return await res.json();
}

export async function generateCoverLetterWithAI(
  resume: ResumeData,
  companyName: string,
  jobTitle: string,
  jobDescription?: string,
  tone?: string
): Promise<{ recipientName: string; companyName: string; jobTitle: string; content: string; keySellingPoints?: string[] }> {
  const res = await fetch('/api/ai/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, companyName, jobTitle, jobDescription, tone }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate cover letter');
  }
  return await res.json();
}

export async function parseResumeTextWithAI(rawText: string): Promise<Partial<ResumeData>> {
  const res = await fetch('/api/ai/parse-resume-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to parse resume text');
  }
  const data = await res.json();
  return data.resume;
}

export async function saveResumeToServer(resume: ResumeData): Promise<void> {
  try {
    await fetch(`/api/resumes/${resume.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });
  } catch (err) {
    console.warn('Server sync failed, will continue local sync', err);
  }
}

export async function createVersionOnServer(resumeId: string, label: string, data: ResumeData): Promise<ResumeVersion | null> {
  try {
    const res = await fetch(`/api/resumes/${resumeId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, data }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.version;
    }
  } catch (err) {
    console.warn('Version sync failed', err);
  }
  return null;
}
