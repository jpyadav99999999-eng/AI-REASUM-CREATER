import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from '../types/resume';

export async function downloadResumePDF(elementId: string, filename: string = 'Resume.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found');
  }

  // Temporary style adjustments for snapshot
  const originalTransform = element.style.transform;
  const originalWidth = element.style.width;
  element.style.transform = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x resolution for ultra-sharp typography
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // Standard A4 pixel width at 96 DPI
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const canvasRatio = canvas.height / canvas.width;
    const totalPdfHeight = pdfWidth * canvasRatio;

    let heightLeft = totalPdfHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if needed
    while (heightLeft > 5) {
      position = heightLeft - totalPdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } finally {
    element.style.transform = originalTransform;
    element.style.width = originalWidth;
  }
}

export function printResume(): void {
  window.print();
}

export function exportResumeAsJSON(resume: ResumeData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const safeName = (resume.personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_');
  downloadAnchor.setAttribute('download', `${safeName}_Resume.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportResumeAsDOCX(resume: ResumeData): void {
  // Construct clean formatted HTML document that Microsoft Word / Google Docs opens natively
  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${resume.personal.fullName || 'Resume'}</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.35; color: #111; margin: 30pt; }
        h1 { font-size: 20pt; color: #1e3a8a; margin-bottom: 2pt; }
        h2 { font-size: 13pt; color: #1e3a8a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 6pt; text-transform: uppercase; }
        .contact { font-size: 10pt; color: #555; margin-bottom: 12pt; }
        .job-title { font-weight: bold; font-size: 11pt; }
        .company { font-style: italic; color: #333; }
        .date { float: right; font-size: 10pt; color: #666; }
        ul { margin-top: 3pt; margin-bottom: 8pt; padding-left: 20pt; }
        li { margin-bottom: 3pt; }
      </style>
    </head>
    <body>
      <h1>${resume.personal.fullName}</h1>
      <div class="contact">
        ${resume.personal.jobTitle} | ${resume.personal.email} | ${resume.personal.phone} | ${resume.personal.location}
        ${resume.personal.linkedin ? ` | ${resume.personal.linkedin}` : ''}
        ${resume.personal.website ? ` | ${resume.personal.website}` : ''}
      </div>

      ${resume.summary ? `<h2>Professional Summary</h2><p>${resume.summary}</p>` : ''}

      ${resume.experience?.length ? `<h2>Work Experience</h2>` : ''}
      ${resume.experience.map(e => `
        <div style="margin-bottom: 8pt;">
          <div><span class="job-title">${e.position}</span>, <span class="company">${e.company}</span> <span class="date">${e.startDate} – ${e.current ? 'Present' : e.endDate}</span></div>
          ${e.description ? `<p style="margin: 2pt 0;">${e.description}</p>` : ''}
          ${e.highlights?.length ? `<ul>${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
        </div>
      `).join('')}

      ${resume.education?.length ? `<h2>Education</h2>` : ''}
      ${resume.education.map(ed => `
        <div style="margin-bottom: 6pt;">
          <span class="job-title">${ed.degree} in ${ed.fieldOfStudy}</span>, <span class="company">${ed.institution}</span> <span class="date">${ed.startDate} – ${ed.endDate}</span>
          ${ed.gpa ? `<div>GPA: ${ed.gpa}</div>` : ''}
        </div>
      `).join('')}

      ${resume.skills?.length ? `
        <h2>Skills</h2>
        <p>${resume.skills.map(s => s.name).join(' • ')}</p>
      ` : ''}

      ${resume.certifications?.length ? `
        <h2>Certifications</h2>
        ${resume.certifications.map(c => `<div><strong>${c.name}</strong> – ${c.issuer} (${c.date})</div>`).join('')}
      ` : ''}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (resume.personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_');
  a.download = `${safeName}_Resume.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
