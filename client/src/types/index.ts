export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  avatarUrl?: string;
  profile?: Profile;
}

export interface Profile {
  id?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  desiredRole?: string;
  targetSalary?: string;
  skills?: Skill[];
  experiences?: Experience[];
  educations?: Education[];
  projects?: Project[];
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  proficiency: string;
  yearsOfExperience?: number;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  bulletPoints: string[];
  technologies?: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  githubRepoUrl?: string;
  liveDemoUrl?: string;
  highlights?: string[];
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  summary?: string;
  rawText?: string;
  templateId: string;
  fileUrl?: string;
  fileName?: string;
  isPrimary?: boolean;
  createdAt: string;
  analyses?: AtsAnalysis[];
  experiences?: Experience[];
  educations?: Education[];
  skills?: Skill[];
  projects?: Project[];
}

export interface AtsDimensionScore {
  name: string;
  score: number;
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

export interface AtsAnalysis {
  id?: string;
  overallAtsScore: number;
  keywordMatchScore: number;
  formattingScore: number;
  impactScore: number;
  dimensions?: AtsDimensionScore[];
  problems?: AtsProblemDetail[];
  matchedKeywords: string[];
  missingKeywords: string[];
  weakBullets: string[];
  strengths: string[];
  improvementSuggestions: string[];
  createdAt?: string;
}

export interface GitHubAudit {
  username: string;
  publicReposCount: number;
  totalStars: number;
  totalForks: number;
  topLanguages: string[];
  technicalScore: number;
  summaryText: string;
  recentRepositories: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
    updatedAt: string;
  }[];
}

export interface JobPosting {
  id: string;
  recruiterId?: string;
  title: string;
  company: string;
  department?: string;
  location: string;
  employmentType: string;
  salaryRange?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  minExperienceYears: number;
  status: string;
  createdAt: string;
}

export interface JobMatch {
  id: string;
  jobDescriptionId: string;
  candidateId: string;
  resumeId?: string;
  matchPercentage: number;
  skillsMatchPercentage: number;
  experienceMatchPercentage: number;
  status: string;
  fitSummary?: string;
  candidate?: User;
  resume?: Resume;
  jobDescription?: JobPosting;
}
