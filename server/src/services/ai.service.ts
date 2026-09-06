import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({ apiKey: config.openai.apiKey });

interface ResumeAnalysisResult {
  atsScore: number;
  keywordScore: number;
  formatScore: number;
  contentScore: number;
  readabilityScore: number;
  overallScore: number;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: { priority: 'high' | 'medium' | 'low'; section: string; suggestion: string }[];
  sectionScores: Record<string, number>;
  keywordDensity: Record<string, number>;
  tokensUsed: number;
}

interface JobMatchResult {
  overallScore: number;
  skillMatchScore: number;
  experienceScore: number;
  educationScore: number;
  keywordScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  strengthPoints: string[];
  gapPoints: string[];
  recommendation: string;
}

export class AIService {
  // ── Resume Analysis ──────────────────────────────────────────────────────────
  async analyzeResume(
    resumeText: string,
    jobDescriptionText: string | null = null,
    targetKeywords: string[] = [],
  ): Promise<ResumeAnalysisResult> {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) and resume analyst with 15+ years of experience in HR and recruitment. You analyze resumes objectively and provide actionable, structured feedback.`;

    const userPrompt = `Analyze the following resume${jobDescriptionText ? ' against the provided job description' : ''} and return a comprehensive JSON analysis.

RESUME:
${resumeText.slice(0, 6000)}

${jobDescriptionText ? `JOB DESCRIPTION:\n${jobDescriptionText.slice(0, 2000)}\n` : ''}
${targetKeywords.length ? `TARGET KEYWORDS: ${targetKeywords.join(', ')}\n` : ''}

Return ONLY valid JSON with this exact structure:
{
  "atsScore": <0-100, how well it passes ATS keyword filters>,
  "keywordScore": <0-100, keyword relevance and density>,
  "formatScore": <0-100, formatting, structure, readability for ATS>,
  "contentScore": <0-100, quality of content, achievements, metrics>,
  "readabilityScore": <0-100, clarity and human readability>,
  "overallScore": <0-100, weighted average>,
  "extractedSkills": ["skill1", "skill2", ...],
  "missingKeywords": ["keyword1", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": [
    { "priority": "high"|"medium"|"low", "section": "section name", "suggestion": "actionable improvement" }
  ],
  "sectionScores": { "summary": 0-100, "experience": 0-100, "education": 0-100, "skills": 0-100 },
  "keywordDensity": { "keyword": count }
}`;

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: config.openai.maxTokens,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty AI response');

    const result = JSON.parse(content);
    result.tokensUsed = response.usage?.total_tokens ?? 0;
    return result as ResumeAnalysisResult;
  }

  // ── Job Match Scoring ─────────────────────────────────────────────────────────
  async computeJobMatch(resumeText: string, jobDescriptionText: string): Promise<JobMatchResult> {
    const systemPrompt = `You are an expert recruiter and ATS specialist. Compare resumes against job descriptions and provide precise match scores.`;

    const userPrompt = `Compare this resume to the job description and return a detailed match analysis as JSON.

RESUME:
${resumeText.slice(0, 5000)}

JOB DESCRIPTION:
${jobDescriptionText.slice(0, 2000)}

Return ONLY valid JSON:
{
  "overallScore": <0-100>,
  "skillMatchScore": <0-100>,
  "experienceScore": <0-100>,
  "educationScore": <0-100>,
  "keywordScore": <0-100>,
  "matchedSkills": ["skill1", ...],
  "missingSkills": ["skill1", ...],
  "matchedKeywords": ["keyword1", ...],
  "missingKeywords": ["keyword1", ...],
  "strengthPoints": ["point1", ...],
  "gapPoints": ["gap1", ...],
  "recommendation": "Strong Match"|"Good Match"|"Partial Match"|"Weak Match"
}`;

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty AI response');
    return JSON.parse(content) as JobMatchResult;
  }

  // ── Career Recommendations ────────────────────────────────────────────────────
  async generateRecommendations(profile: object, recentAnalysis: object | null): Promise<{
    type: string;
    title: string;
    description: string;
    priority: number;
    actionUrl?: string;
  }[]> {
    const systemPrompt = `You are a career advisor AI. Generate personalized, actionable career recommendations based on a candidate's profile and resume analysis.`;

    const userPrompt = `Based on this candidate profile and analysis, generate 5-8 personalized career recommendations.

PROFILE: ${JSON.stringify(profile).slice(0, 2000)}
${recentAnalysis ? `RECENT ANALYSIS: ${JSON.stringify(recentAnalysis).slice(0, 1000)}` : ''}

Return ONLY valid JSON array:
[{
  "type": "skill_gap"|"course"|"job_title"|"resume_improvement"|"career_path",
  "title": "short title",
  "description": "detailed actionable description",
  "priority": 1|2|3,
  "actionUrl": "optional URL"
}]`;

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty AI response');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : (parsed.recommendations ?? []);
  }
}

export const aiService = new AIService();
