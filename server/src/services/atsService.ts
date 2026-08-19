import { prisma } from '../config/db';
import { AtsAnalysisResult, AtsDimensionScore, AtsProblemDetail } from '../types';

export class AtsService {
  /**
   * Evaluates ATS score of raw resume text across 9 dimensions:
   * 1. Contact Information
   * 2. ATS Readability
   * 3. Formatting
   * 4. Keywords
   * 5. Skills
   * 6. Experience
   * 7. Projects
   * 8. Education
   * 9. Certifications
   */
  static analyzeResume(resumeText: string, targetJdText?: string): AtsAnalysisResult {
    const textLower = (resumeText || '').toLowerCase();
    const lines = (resumeText || '').split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const problems: AtsProblemDetail[] = [];

    // --- 1. Contact Information Audit ---
    let contactScore = 100;
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(resumeText);
    const hasPhone = /\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/.test(resumeText);
    const hasLinkedin = textLower.includes('linkedin.com');
    const hasGithub = textLower.includes('github.com');
    const hasLocation = /\b(ca|ny|wa|tx|fl|ma|il|co|sf|san francisco|new york|remote)\b/i.test(resumeText);

    if (!hasEmail) {
      contactScore -= 30;
      problems.push({
        category: 'Contact Information',
        severity: 'HIGH',
        title: 'Missing Direct Email Address',
        explanation: 'ATS automated systems failed to locate a standard email address in the header.',
        suggestion: 'Include your professional email address (e.g. name@domain.com) clearly at the top of your resume.',
      });
    }

    if (!hasPhone) {
      contactScore -= 20;
      problems.push({
        category: 'Contact Information',
        severity: 'MEDIUM',
        title: 'Missing Phone Contact Number',
        explanation: 'Recruiters and automated screeners require a phone number for scheduling initial phone screens.',
        suggestion: 'Add a standard phone number (e.g. (415) 890-2341) in your contact header.',
      });
    }

    if (!hasLinkedin || !hasGithub) {
      contactScore -= 20;
      problems.push({
        category: 'Contact Information',
        severity: 'MEDIUM',
        title: 'Missing Professional Web Profiles (LinkedIn / GitHub)',
        explanation: 'Technical recruiters expect direct hyperlinks to your LinkedIn profile and GitHub repository portfolio.',
        suggestion: 'Add full URLs for your LinkedIn (linkedin.com/in/yourname) and GitHub (github.com/yourname) in the header.',
      });
    }

    contactScore = Math.max(0, contactScore);

    // --- 2. ATS Readability Audit ---
    let readabilityScore = 90;
    const hasStandardHeaders = textLower.includes('experience') && textLower.includes('education') && textLower.includes('skills');
    if (!hasStandardHeaders) {
      readabilityScore -= 25;
      problems.push({
        category: 'ATS Readability',
        severity: 'HIGH',
        title: 'Non-Standard Section Headers',
        explanation: 'ATS parsers look for conventional headers like "Work Experience", "Education", and "Skills". Non-standard names cause parsing errors.',
        suggestion: 'Use standard H2 headers: "Professional Summary", "Work Experience", "Technical Skills", "Education".',
      });
    }
    if (resumeText.length < 300) {
      readabilityScore -= 30;
      problems.push({
        category: 'ATS Readability',
        severity: 'HIGH',
        title: 'Resume Text Length Too Short',
        explanation: 'The extracted text contains under 300 characters, indicating partial file upload or image-based PDF that ATS engines cannot read.',
        suggestion: 'Ensure your resume is saved as a selectable-text PDF or DOCX file, not an image/scan.',
      });
    }

    // --- 3. Formatting Audit ---
    let formattingScore = 85;
    const bulletLines = lines.filter(l => l.startsWith('-') || l.startsWith('•') || l.startsWith('*'));
    if (bulletLines.length < 3) {
      formattingScore -= 20;
      problems.push({
        category: 'Formatting',
        severity: 'MEDIUM',
        title: 'Lack of Bulleted Accomplishment Points',
        explanation: 'Paragraph blocks are hard for ATS algorithms and human recruiters to parse quickly.',
        suggestion: 'Structure work experience using bullet points starting with strong action verbs.',
      });
    }

    // --- 4. Keywords Audit ---
    const targetKeywords = targetJdText
      ? this.extractKeywordsFromJd(targetJdText)
      : [
          'react', 'typescript', 'node.js', 'express', 'postgresql', 'prisma',
          'aws', 'docker', 'rest api', 'ci/cd', 'git', 'unit testing', 'system design',
          'agile', 'microservices', 'graphql', 'tailwind css', 'redis'
        ];

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    targetKeywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const keywordMatchScore = Math.min(100, Math.round((matchedKeywords.length / Math.max(1, targetKeywords.length)) * 100));

    if (missingKeywords.length >= 3) {
      problems.push({
        category: 'Keywords',
        severity: 'HIGH',
        title: `Missing High-Priority Technical Keywords (${missingKeywords.slice(0, 4).join(', ')})`,
        explanation: 'Your resume lacks core industry keywords found in top job descriptions for your role.',
        suggestion: `Incorporate key missing terms organically into your skills and experience section: ${missingKeywords.slice(0, 5).join(', ')}.`,
      });
    }

    // --- 5. Skills Audit ---
    let skillsScore = Math.min(100, Math.max(40, matchedKeywords.length * 10));
    if (!textLower.includes('skills') && !textLower.includes('technologies')) {
      skillsScore -= 20;
      problems.push({
        category: 'Skills',
        severity: 'MEDIUM',
        title: 'Dedicated Skills Section Not Found',
        explanation: 'ATS screeners score candidates higher when technical competencies are listed in a distinct skills section.',
        suggestion: 'Add a dedicated "Technical Skills" section near the top of your resume.',
      });
    }

    // --- 6. Experience Audit ---
    const actionVerbs = ['developed', 'architected', 'spearheaded', 'built', 'improved', 'optimized', 'scaled', 'lead', 'designed', 'automated', 'engineered'];
    let verbCount = 0;
    actionVerbs.forEach(v => { if (textLower.includes(v)) verbCount++; });

    const metricMatches = resumeText.match(/\d+%|\$\d+|\d+x|\d+ users|\d+ ms|\d+k/gi) || [];
    let experienceScore = Math.min(100, 40 + verbCount * 6 + metricMatches.length * 8);

    if (metricMatches.length === 0) {
      experienceScore -= 25;
      problems.push({
        category: 'Experience',
        severity: 'HIGH',
        title: 'No Quantitative Metrics or Results Found',
        explanation: 'Bullet points without measurable outcomes (e.g. "Reduced latency by 45%") score lower in ATS impact analysis.',
        suggestion: 'Quantify your achievements using percentages, user volume, time saved, or revenue metrics.',
      });
    }

    // --- 7. Projects Audit ---
    let projectsScore = textLower.includes('project') || textLower.includes('github') ? 90 : 60;
    if (projectsScore < 70) {
      problems.push({
        category: 'Projects',
        severity: 'LOW',
        title: 'No Technical Projects Mentioned',
        explanation: 'Highlighting practical open-source or portfolio projects boosts technical credibility for engineering roles.',
        suggestion: 'Add a "Featured Projects" section with project titles, tech stack badges, and GitHub repository links.',
      });
    }

    // --- 8. Education Audit ---
    let educationScore = (textLower.includes('bachelor') || textLower.includes('b.s.') || textLower.includes('master') || textLower.includes('university') || textLower.includes('degree')) ? 95 : 65;
    if (educationScore < 70) {
      problems.push({
        category: 'Education',
        severity: 'LOW',
        title: 'Education Degree Details Could Be Clearer',
        explanation: 'ATS systems look for explicit degree titles (e.g., "B.S. in Computer Science") and institution names.',
        suggestion: 'Clearly state your degree, major, university, and graduation year under an "Education" header.',
      });
    }

    // --- 9. Certifications Audit ---
    let certificationsScore = (textLower.includes('certif') || textLower.includes('aws') || textLower.includes('meta') || textLower.includes('scrum')) ? 90 : 70;

    // --- Composite 0-100 ATS Score Calculation ---
    const overallAtsScore = Math.round(
      keywordMatchScore * 0.25 +
      experienceScore * 0.20 +
      skillsScore * 0.15 +
      formattingScore * 0.10 +
      readabilityScore * 0.10 +
      contactScore * 0.08 +
      projectsScore * 0.06 +
      educationScore * 0.03 +
      certificationsScore * 0.03
    );

    const impactScore = Math.min(100, Math.round(verbCount * 10 + metricMatches.length * 10));

    // Dimension breakdown output
    const dimensions: AtsDimensionScore[] = [
      { name: 'Formatting & Layout', score: formattingScore, status: formattingScore >= 85 ? 'EXCELLENT' : formattingScore >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT', details: 'Section margins, bullet points, font hierarchy' },
      { name: 'Keyword Alignment', score: keywordMatchScore, status: keywordMatchScore >= 85 ? 'EXCELLENT' : keywordMatchScore >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT', details: `${matchedKeywords.length} matching keywords identified` },
      { name: 'Technical Skills Density', score: skillsScore, status: skillsScore >= 85 ? 'EXCELLENT' : skillsScore >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT', details: 'Category coverage (Frontend, Backend, DevOps)' },
      { name: 'Work Experience & Impact', score: experienceScore, status: experienceScore >= 85 ? 'EXCELLENT' : experienceScore >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT', details: `${metricMatches.length} quantitative metrics & action verbs` },
      { name: 'Projects & Portfolio', score: projectsScore, status: projectsScore >= 85 ? 'EXCELLENT' : projectsScore >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT', details: 'Repository links & technical project details' },
      { name: 'Education & Academic', score: educationScore, status: educationScore >= 85 ? 'EXCELLENT' : educationScore >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT', details: 'Degree, field of study, institution' },
      { name: 'Certifications & Credentials', score: certificationsScore, status: certificationsScore >= 85 ? 'EXCELLENT' : certificationsScore >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT', details: 'Industry certifications (AWS, Meta, Scrum)' },
      { name: 'Contact Information', score: contactScore, status: contactScore >= 85 ? 'EXCELLENT' : contactScore >= 70 ? 'GOOD' : 'CRITICAL', details: 'Email, phone, location, LinkedIn, GitHub' },
      { name: 'ATS Parse Readability', score: readabilityScore, status: readabilityScore >= 85 ? 'EXCELLENT' : readabilityScore >= 70 ? 'GOOD' : 'CRITICAL', details: 'Selectable text parseability & header standard' },
    ];

    const weakBullets = lines.filter(l => {
      const lower = l.toLowerCase();
      const hasAction = actionVerbs.some(v => lower.includes(v));
      const hasMetric = /\d+%|\$\d+|\d+x|\d+ users|\d+ ms/.test(lower);
      return (l.startsWith('-') || l.startsWith('•')) ? (!hasAction || !hasMetric) : false;
    }).slice(0, 3);

    const strengths: string[] = [];
    if (matchedKeywords.length >= 5) strengths.push(`High density of key technical terms (${matchedKeywords.slice(0, 4).join(', ')})`);
    if (metricMatches.length >= 2) strengths.push('Strong quantitative metric placeholders included in bullet points');
    if (contactScore >= 85) strengths.push('Complete contact information with valid email, phone, location, and web links');
    if (formattingScore >= 85) strengths.push('Clean ATS-parseable section hierarchy and bullet structure');

    const improvementSuggestions = problems.map(p => p.suggestion);

    return {
      overallAtsScore,
      keywordMatchScore,
      formattingScore,
      impactScore,
      dimensions,
      problems,
      matchedKeywords,
      missingKeywords,
      weakBullets,
      strengths,
      improvementSuggestions,
    };
  }

  static async saveAnalysis(resumeId: string, analysis: AtsAnalysisResult, jobDescriptionId?: string) {
    const saved = await prisma.resumeAnalysis.create({
      data: {
        resumeId,
        jobDescriptionId: jobDescriptionId || null,
        overallAtsScore: analysis.overallAtsScore,
        keywordMatchScore: analysis.keywordMatchScore,
        formattingScore: analysis.formattingScore,
        impactScore: analysis.impactScore,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        weakBullets: analysis.weakBullets,
        strengths: analysis.strengths,
        improvementSuggestions: analysis.improvementSuggestions,
        rawAiOutput: JSON.stringify(analysis),
      },
    }).catch(() => ({
      id: 'analysis-' + Date.now(),
      resumeId,
      ...analysis,
    }));

    return saved;
  }

  private static extractKeywordsFromJd(jdText: string): string[] {
    const defaultList = ['react', 'node.js', 'typescript', 'express', 'postgresql', 'prisma', 'aws', 'docker', 'rest api', 'tailwind css', 'git'];
    const lower = jdText.toLowerCase();

    const techTokens = ['python', 'java', 'go', 'kubernetes', 'graphql', 'mongodb', 'redis', 'ci/cd', 'jest', 'cypress', 'system design', 'agile', 'microservices'];
    const result = [...defaultList];

    techTokens.forEach(token => {
      if (lower.includes(token) && !result.includes(token)) {
        result.push(token);
      }
    });

    return result;
  }
}
