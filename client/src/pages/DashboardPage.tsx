import { ATSScore } from '../components/dashboard/ATSScore';
import { ProfileStrength } from '../components/dashboard/ProfileStrength';
import { ResumeStatus } from '../components/dashboard/ResumeStatus';
import { Skills } from '../components/dashboard/Skills';
import { Projects } from '../components/dashboard/Projects';
import { Certifications } from '../components/dashboard/Certifications';
import { GitHubInsights } from '../components/dashboard/GitHubInsights';
import { JobMatchScore } from '../components/dashboard/JobMatchScore';
import { AIRecommendations } from '../components/dashboard/AIRecommendations';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../store/authContext';

const mockATSBreakdown = [
  { label: 'Format & Structure', score: 92, status: 'good' as const, description: 'Clean, ATS-friendly formatting with standard sections' },
  { label: 'Keyword Optimization', score: 78, status: 'warning' as const, description: 'Good keyword coverage, missing 3-4 key terms' },
  { label: 'Content Quality', score: 85, status: 'good' as const, description: 'Strong action verbs and quantified achievements' },
  { label: 'Skills Match', score: 72, status: 'warning' as const, description: '8 of 12 required skills found' },
  { label: 'Experience Relevance', score: 88, status: 'good' as const, description: 'Highly relevant experience for target roles' },
];

const mockProfileSections = [
  { id: 'headline', label: 'Professional Headline', description: 'Compelling headline that captures your value proposition', completed: true, required: true },
  { id: 'summary', label: 'Professional Summary', description: '3-5 sentence overview of your experience and goals', completed: true, required: true },
  { id: 'experience', label: 'Work Experience', description: 'Detailed work history with achievements', completed: true, required: true },
  { id: 'education', label: 'Education', description: 'Degrees, certifications, and relevant coursework', completed: true, required: true },
  { id: 'skills', label: 'Skills', description: 'Technical and soft skills with proficiency levels', completed: true, required: true },
  { id: 'projects', label: 'Projects', description: 'Key projects demonstrating your abilities', completed: false, required: false, actionLabel: 'Add' },
  { id: 'certifications', label: 'Certifications', description: 'Professional certifications and licenses', completed: false, required: false, actionLabel: 'Add' },
  { id: 'github', label: 'GitHub Profile', description: 'Connected GitHub account with repository insights', completed: false, required: false, actionLabel: 'Connect' },
];

const mockSkills = [
  { id: '1', name: 'React', category: 'Frontend', proficiency: 95, yearsOfExperience: 4, isTopSkill: true },
  { id: '2', name: 'TypeScript', category: 'Frontend', proficiency: 90, yearsOfExperience: 3, isTopSkill: true },
  { id: '3', name: 'Node.js', category: 'Backend', proficiency: 85, yearsOfExperience: 3 },
  { id: '4', name: 'PostgreSQL', category: 'Database', proficiency: 80, yearsOfExperience: 2 },
  { id: '5', name: 'AWS', category: 'DevOps', proficiency: 70, yearsOfExperience: 2 },
  { id: '6', name: 'Docker', category: 'DevOps', proficiency: 75, yearsOfExperience: 2 },
  { id: '7', name: 'Python', category: 'Backend', proficiency: 65, yearsOfExperience: 1 },
  { id: '8', name: 'GraphQL', category: 'Backend', proficiency: 60, yearsOfExperience: 1 },
  { id: '9', name: 'Testing (Jest/Cypress)', category: 'Testing', proficiency: 80, yearsOfExperience: 2 },
  { id: '10', name: 'CI/CD', category: 'DevOps', proficiency: 70, yearsOfExperience: 2 },
  { id: '11', name: 'Agile/Scrum', category: 'Soft Skills', proficiency: 85, yearsOfExperience: 4 },
  { id: '12', name: 'System Design', category: 'Soft Skills', proficiency: 75, yearsOfExperience: 3 },
];

const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
    url: 'https://example.com',
    githubUrl: 'https://github.com',
    startDate: new Date('2023-01-15'),
    endDate: new Date('2023-06-30'),
    current: false,
    featured: true,
  },
  {
    id: '2',
    name: 'Task Management App',
    description: 'Collaborative project management tool with real-time updates, team workspaces, and analytics',
    technologies: ['React', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Apollo'],
    url: 'https://example.com',
    githubUrl: 'https://github.com',
    startDate: new Date('2022-06-01'),
    endDate: new Date('2022-12-31'),
    current: false,
    featured: true,
  },
  {
    id: '3',
    name: 'Open Source CLI Tool',
    description: 'Developer productivity tool for automating repetitive tasks',
    technologies: ['TypeScript', 'Node.js', 'Commander.js'],
    githubUrl: 'https://github.com',
    startDate: new Date('2023-03-01'),
    endDate: null,
    current: true,
    featured: false,
  },
];

const mockCertifications = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    issueDate: new Date('2023-03-15'),
    expiryDate: new Date('2026-03-15'),
    credentialId: 'AWS-SAA-123456',
    credentialUrl: 'https://aws.amazon.com/verification',
    featured: true,
  },
  {
    id: '2',
    name: 'Google Cloud Professional Cloud Developer',
    issuer: 'Google Cloud',
    issueDate: new Date('2022-11-20'),
    expiryDate: new Date('2025-11-20'),
    credentialId: 'GCP-PCD-789012',
    credentialUrl: 'https://cloud.google.com/certification',
    featured: false,
  },
  {
    id: '3',
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Linux Foundation',
    issueDate: new Date('2023-07-10'),
    expiryDate: new Date('2026-07-10'),
    credentialId: 'CKA-345678',
    credentialUrl: 'https://training.linuxfoundation.org/certification',
    featured: true,
  },
];

const mockGitHubStats = {
  totalRepos: 42,
  totalStars: 156,
  totalForks: 89,
  followers: 234,
  following: 156,
  contributionsThisYear: 1247,
  longestStreak: 45,
  currentStreak: 12,
};

const mockLanguages = [
  { language: 'TypeScript', percentage: 35.2, color: '#3178c6', bytes: 2450000 },
  { language: 'JavaScript', percentage: 22.1, color: '#f1e05a', bytes: 1540000 },
  { language: 'Python', percentage: 15.8, color: '#3572A5', bytes: 1100000 },
  { language: 'Go', percentage: 10.5, color: '#00ADD8', bytes: 730000 },
  { language: 'Rust', percentage: 8.2, color: '#dea584', bytes: 570000 },
  { language: 'SQL', percentage: 4.1, color: '#e38c00', bytes: 285000 },
  { language: 'Dockerfile', percentage: 2.3, color: '#384d54', bytes: 160000 },
  { language: 'HTML/CSS', percentage: 1.8, color: '#e34c26', bytes: 125000 },
];

const mockTopRepos = [
  {
    name: 'awesome-cli-tool',
    description: 'A powerful CLI tool for developer productivity',
    stars: 1240,
    forks: 89,
    language: 'TypeScript',
    url: 'https://github.com/user/awesome-cli-tool',
    updatedAt: new Date('2024-01-15'),
  },
  {
    name: 'react-component-library',
    description: 'Accessible React component library with TypeScript',
    stars: 856,
    forks: 124,
    language: 'TypeScript',
    url: 'https://github.com/user/react-component-library',
    updatedAt: new Date('2024-01-10'),
  },
  {
    name: 'go-microservice-template',
    description: 'Production-ready Go microservice template',
    stars: 432,
    forks: 67,
    language: 'Go',
    url: 'https://github.com/user/go-microservice-template',
    updatedAt: new Date('2023-12-20'),
  },
];

const mockJobMatches = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Inc',
    location: 'San Francisco, CA (Remote)',
    type: 'Full-time',
    matchScore: 92,
    matchedSkills: ['React', 'TypeScript', 'GraphQL', 'Testing', 'CI/CD', 'System Design'],
    missingSkills: ['Next.js', 'WebGL'],
    salaryRange: { min: 160000, max: 220000 },
    postedDate: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    matchScore: 87,
    matchedSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Docker'],
    missingSkills: ['Kubernetes', 'GraphQL'],
    salaryRange: { min: 140000, max: 180000 },
    postedDate: new Date('2024-01-08'),
  },
  {
    id: '3',
    title: 'Frontend Architect',
    company: 'Enterprise Solutions',
    location: 'Austin, TX (On-site)',
    type: 'Full-time',
    matchScore: 84,
    matchedSkills: ['React', 'TypeScript', 'System Design', 'Testing', 'Mentoring'],
    missingSkills: ['Micro-frontends', 'Module Federation'],
    salaryRange: { min: 150000, max: 200000 },
    postedDate: new Date('2024-01-05'),
  },
];

const mockRecommendations = [
  {
    id: '1',
    type: 'skill' as const,
    title: 'Learn Next.js 14',
    description: 'Next.js is the most requested React framework in job postings. Adding it to your skillset could increase match scores by 15%.',
    priority: 'high' as const,
    impact: 85,
    effort: 'medium' as const,
    actionLabel: 'Start Learning',
    actionUrl: 'https://nextjs.org/learn',
  },
  {
    id: '2',
    type: 'certification' as const,
    title: 'AWS Certified Developer Associate',
    description: 'Your AWS experience is strong but uncertified. This certification validates your cloud skills and appears in 40% of senior roles.',
    priority: 'high' as const,
    impact: 78,
    effort: 'high' as const,
    actionLabel: 'View Exam Guide',
    actionUrl: 'https://aws.amazon.com/certification/certified-developer-associate/',
  },
  {
    id: '3',
    type: 'project' as const,
    title: 'Build a Micro-frontend Demo',
    description: 'Create a portfolio project demonstrating Module Federation. This cutting-edge skill appears in 25% of architect roles.',
    priority: 'medium' as const,
    impact: 72,
    effort: 'high' as const,
    actionLabel: 'View Tutorial',
    actionUrl: 'https://webpack.js.org/concepts/module-federation/',
  },
  {
    id: '4',
    type: 'skill' as const,
    title: 'Add Kubernetes to Skills',
    description: 'Kubernetes appears in 60% of DevOps/Backend roles. Your Docker experience makes this a natural next step.',
    priority: 'medium' as const,
    impact: 68,
    effort: 'medium' as const,
    actionLabel: 'Add to Profile',
    onAction: () => {},
  },
  {
    id: '5',
    type: 'profile' as const,
    title: 'Complete Projects Section',
    description: 'Profiles with 3+ projects get 40% more views. Add your open-source CLI tool and e-commerce platform.',
    priority: 'medium' as const,
    impact: 65,
    effort: 'low' as const,
    actionLabel: 'Add Projects',
    onAction: () => {},
  },
  {
    id: '6',
    type: 'course' as const,
    title: 'System Design Interview Prep',
    description: 'System design questions appear in 80% of senior interviews. This course covers the fundamentals.',
    priority: 'low' as const,
    impact: 55,
    effort: 'high' as const,
    actionLabel: 'Enroll Now',
    actionUrl: 'https://systemdesignprimer.com',
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Welcome back, {user?.firstName}!</h1>
          <p className="mt-1 text-secondary-600">Here's your career dashboard overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline">
            <MagnifyingGlassIcon className="w-4 h-4" />
            Find Jobs
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4" />
            Upload Resume
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ATSScore
          score={83}
          breakdown={mockATSBreakdown}
          lastAnalyzed={new Date('2024-01-10')}
          onReanalyze={() => {}}
        />
        <ProfileStrength
          score={78}
          sections={mockProfileSections}
          onSectionClick={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResumeStatus
          resumes={[
            {
              id: '1',
              title: 'Senior Frontend Engineer Resume',
              fileName: 'john-doe-frontend-resume.pdf',
              status: 'published' as const,
              atsScore: 83,
              lastAnalyzed: new Date('2024-01-10'),
              fileSize: 245760,
              updatedAt: new Date('2024-01-10'),
            },
            {
              id: '2',
              title: 'Full Stack Developer Resume',
              fileName: 'john-doe-fullstack-resume.pdf',
              status: 'draft' as const,
              fileSize: 198432,
              updatedAt: new Date('2024-01-05'),
            },
          ]}
          onView={() => {}}
          onAnalyze={() => {}}
          onDownload={() => {}}
          onUploadNew={() => {}}
        />
        <Skills
          skills={mockSkills}
          categories={['Frontend', 'Backend', 'Database', 'DevOps', 'Testing', 'Soft Skills']}
          onAddSkill={() => {}}
          editable
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Projects
          projects={mockProjects}
          onAddProject={() => {}}
          editable
          maxVisible={3}
        />
        <Certifications
          certifications={mockCertifications}
          onAddCertification={() => {}}
          editable
        />
      </div>

      <GitHubInsights
        stats={mockGitHubStats}
        languages={mockLanguages}
        topRepos={mockTopRepos}
        onSync={() => {}}
        lastSynced={new Date('2024-01-12')}
      />

      <JobMatchScore
        matches={mockJobMatches}
        onViewJob={() => {}}
        onApplyJob={() => {}}
      />

      <AIRecommendations
        recommendations={mockRecommendations}
        onAction={() => {}}
        onDismiss={() => {}}
        maxVisible={5}
      />
    </div>
  );
};