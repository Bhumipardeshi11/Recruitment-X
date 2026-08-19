import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RecruitmentX Database Seed...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 1. Create Demo Candidate
  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@recruitmentx.ai' },
    update: {},
    create: {
      email: 'candidate@recruitmentx.ai',
      passwordHash,
      fullName: 'Alex Vance',
      role: 'CANDIDATE',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      profile: {
        create: {
          headline: 'Senior Full-Stack & AI Engineer',
          bio: '5+ years experience building React frontends, Express APIs, and AI workflows.',
          location: 'San Francisco, CA',
          websiteUrl: 'https://alexvance.dev',
          linkedinUrl: 'https://linkedin.com/in/alexvance',
          githubUrl: 'https://github.com/alexvance',
          desiredRole: 'Senior Software Engineer',
          targetSalary: '$160,000',
        },
      },
      gitHubProfile: {
        create: {
          username: 'alexvance',
          publicReposCount: 22,
          totalStars: 58,
          totalForks: 16,
          topLanguages: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
          technicalScore: 92,
          summaryText: 'Top 5% GitHub contributor with high commit activity in React & Express frameworks.',
        },
      },
    },
  });

  // 2. Create Demo Recruiter
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@recruitmentx.ai' },
    update: {},
    create: {
      email: 'recruiter@recruitmentx.ai',
      passwordHash,
      fullName: 'Sarah Jenkins',
      role: 'RECRUITER',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      profile: {
        create: {
          headline: 'Lead Technical Recruiter @ Apex AI',
          bio: 'Hiring world-class engineering talent in full-stack, AI, and distributed systems.',
          location: 'New York, NY',
        },
      },
    },
  });

  // 3. Create Sample Job Description
  const job = await prisma.jobDescription.create({
    data: {
      recruiterId: recruiter.id,
      title: 'Senior Full-Stack Engineer (React & Node.js)',
      company: 'Apex AI Systems',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'FULL_TIME',
      salaryRange: '$150,000 - $190,000',
      description: 'We are seeking a Senior Full-Stack Engineer to lead the architecture of our AI career optimization platform.',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
      preferredSkills: ['AWS S3', 'Docker', 'Google Gemini AI', 'GitHub REST API'],
      minExperienceYears: 4,
      status: 'ACTIVE',
    },
  });

  // 4. Create Candidate Resume & Analysis
  const resume = await prisma.resume.create({
    data: {
      userId: candidate.id,
      title: 'Alex Vance - Senior Full Stack Resume 2026',
      summary: 'Architected high-throughput REST APIs and dynamic React dashboards using TypeScript, Express, and Prisma.',
      templateId: 'modern',
      isPrimary: true,
      rawText: `Alex Vance
Senior Full Stack Engineer
Email: candidate@recruitmentx.ai | Location: San Francisco, CA

SUMMARY
Senior Engineer with 5+ years of hands-on experience building React applications, Node.js Express REST APIs, PostgreSQL databases, and AI integrations.

SKILLS
- Frontend: React, TypeScript, Tailwind CSS, Vite, Redux
- Backend: Node.js, Express, PostgreSQL, Prisma ORM, REST APIs, GraphQL
- Cloud & DevOps: AWS S3, Docker, CI/CD GitHub Actions

EXPERIENCE
Lead Full Stack Engineer | TechCorp Inc. (2023 - Present)
- Architected and launched a real-time analytics portal serving 150,000 monthly active users.
- Optimized PostgreSQL database queries with Prisma ORM, reducing 95th percentile query latency by 45%.
- Integrated AI automated summary features using OpenAI/Gemini REST endpoints.

Software Engineer | DevLabs (2021 - 2023)
- Built 20+ responsive UI components in React and TypeScript.
- Implemented JWT authentication and RBAC authorization across Express microservices.

EDUCATION
B.S. in Computer Science | University of California, Berkeley`,
    },
  });

  await prisma.resumeAnalysis.create({
    data: {
      resumeId: resume.id,
      jobDescriptionId: job.id,
      overallAtsScore: 94,
      keywordMatchScore: 96,
      formattingScore: 90,
      impactScore: 95,
      matchedKeywords: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'AWS', 'Docker'],
      missingKeywords: ['Kubernetes', 'GraphQL'],
      weakBullets: [],
      strengths: [
        'Outstanding technical keyword alignment with senior full-stack roles',
        'Strong metric-driven accomplishment bullet points',
        'Clean section hierarchy and contact info',
      ],
      improvementSuggestions: [
        'Add quantitative impact metrics to early career experience at DevLabs.',
      ],
    },
  });

  // 5. Create Job Match
  await prisma.jobMatch.create({
    data: {
      jobDescriptionId: job.id,
      candidateId: candidate.id,
      resumeId: resume.id,
      matchPercentage: 94.0,
      skillsMatchPercentage: 96.0,
      experienceMatchPercentage: 92.0,
      fitSummary: 'Exceptional match for Senior Full-Stack role. Candidate demonstrates direct experience with Express, Prisma, React, and AI REST integrations.',
    },
  });

  console.log('✅ RecruitmentX Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
