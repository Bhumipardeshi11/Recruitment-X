import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AtsDimensionScore {
  name: string; // Formatting, Keywords, Skills, Experience, Projects, Education, Certifications, Contact Info, ATS Readability
  score: number; // 0 - 100
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
  details: string;
}

export interface AtsProblemDetail {
  category: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  explanation: string;
  suggestion: string;
}

export interface AtsAnalysisResult {
  overallAtsScore: number;
  keywordMatchScore: number;
  formattingScore: number;
  impactScore: number;
  dimensions: AtsDimensionScore[];
  problems: AtsProblemDetail[];
  matchedKeywords: string[];
  missingKeywords: string[];
  weakBullets: string[];
  strengths: string[];
  improvementSuggestions: string[];
  rawAiOutput?: string;
}

export interface GitHubAuditResult {
  username: string;
  publicReposCount: number;
  totalStars: number;
  totalForks: number;
  topLanguages: string[];
  technicalScore: number;
  summaryText: string;
  recentRepositories: any[];
}
