export interface RoadmapStep {
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  duration: string;
  reason: string;
  topics: string[];
  project: string;
}

const ROADMAP_DATA: Record<string, RoadmapStep> = {
  javascript: {
    title: 'JavaScript Fundamentals',
    priority: 'HIGH',
    duration: '4–5 days',
    reason: 'JavaScript is required for modern frontend development and is the foundation of React and many backend technologies.',
    topics: [
      'Variables and data types',
      'Functions',
      'Arrays and objects',
      'ES6+ features',
      'Promises',
      'async/await',
      'API calls',
      'Error handling'
    ],
    project: 'Build a Job Search Dashboard using JavaScript and a public API.'
  },

  react: {
    title: 'React Development',
    priority: 'HIGH',
    duration: '5–7 days',
    reason: 'React is listed as a required skill in the job description.',
    topics: [
      'Components',
      'Props',
      'State and useState',
      'useEffect',
      'Forms',
      'Conditional rendering',
      'API integration',
      'React Router'
    ],
    project: 'Build a Job Application Tracker using React.'
  },

  express: {
    title: 'Backend Development with Express',
    priority: 'HIGH',
    duration: '5–7 days',
    reason: 'Express is required for building backend services and APIs.',
    topics: [
      'Node.js fundamentals',
      'Express setup',
      'Routing',
      'Middleware',
      'Request and response',
      'Error handling',
      'Authentication',
      'API development'
    ],
    project: 'Build a Resume Management REST API using Node.js and Express.'
  },

  rest: {
    title: 'REST API Development',
    priority: 'HIGH',
    duration: '3–4 days',
    reason: 'REST APIs are required for communication between frontend and backend applications.',
    topics: [
      'REST architecture',
      'GET requests',
      'POST requests',
      'PUT requests',
      'DELETE requests',
      'HTTP status codes',
      'JSON',
      'API error handling'
    ],
    project: 'Create a REST API for managing resumes and job applications.'
  },

  apis: {
    title: 'API Integration',
    priority: 'HIGH',
    duration: '2–3 days',
    reason: 'API knowledge is important for connecting frontend applications with backend services.',
    topics: [
      'HTTP requests',
      'Fetch API',
      'Axios',
      'Request headers',
      'Authentication tokens',
      'Handling API errors'
    ],
    project: 'Connect a React frontend with your Express backend.'
  },

  mongodb: {
    title: 'MongoDB & Mongoose',
    priority: 'MEDIUM',
    duration: '4–5 days',
    reason: 'MongoDB is required for storing application data in a NoSQL database.',
    topics: [
      'Collections',
      'Documents',
      'CRUD operations',
      'MongoDB queries',
      'Mongoose',
      'Schemas',
      'Relationships',
      'Indexes'
    ],
    project: 'Build a database for users, resumes and job applications.'
  },

  sql: {
    title: 'SQL & Relational Databases',
    priority: 'MEDIUM',
    duration: '4–5 days',
    reason: 'SQL is commonly required for working with relational databases and data analysis.',
    topics: [
      'SELECT',
      'WHERE',
      'ORDER BY',
      'GROUP BY',
      'JOIN',
      'Subqueries',
      'Aggregations',
      'Indexes'
    ],
    project: 'Create a job application tracking database using SQL.'
  },

  git: {
    title: 'Git & Version Control',
    priority: 'MEDIUM',
    duration: '1–2 days',
    reason: 'Git is an essential development and collaboration skill.',
    topics: [
      'git init',
      'git clone',
      'git add',
      'git commit',
      'git push',
      'git pull',
      'Branches',
      'Merge conflicts'
    ],
    project: 'Create a GitHub repository and maintain your project using proper commits and branches.'
  },

  github: {
    title: 'GitHub & Collaboration',
    priority: 'MEDIUM',
    duration: '1–2 days',
    reason: 'GitHub is required for collaborative software development and project management.',
    topics: [
      'Repositories',
      'README files',
      'Branches',
      'Pull requests',
      'Issues',
      'GitHub Actions basics'
    ],
    project: 'Publish your project on GitHub with a professional README.'
  },

  aws: {
    title: 'AWS & Cloud Fundamentals',
    priority: 'HIGH',
    duration: '5–7 days',
    reason: 'AWS is explicitly required by the job description and is important for cloud deployment.',
    topics: [
      'AWS fundamentals',
      'IAM',
      'EC2',
      'S3',
      'RDS',
      'Security basics',
      'Cloud deployment'
    ],
    project: 'Deploy your full-stack application using AWS EC2 and S3.'
  },

  cloud: {
    title: 'Cloud Computing',
    priority: 'HIGH',
    duration: '3–5 days',
    reason: 'Cloud knowledge is important for deploying and scaling modern applications.',
    topics: [
      'Cloud computing basics',
      'IaaS',
      'PaaS',
      'Storage',
      'Compute',
      'Networking',
      'Cloud security'
    ],
    project: 'Deploy a web application on a cloud platform.'
  },

  ai: {
    title: 'AI & Generative AI',
    priority: 'MEDIUM',
    duration: '5–7 days',
    reason: 'AI is mentioned in the job requirements and can enhance modern applications.',
    topics: [
      'AI fundamentals',
      'Machine learning basics',
      'LLMs',
      'Prompt engineering',
      'AI APIs',
      'Embeddings',
      'RAG basics'
    ],
    project: 'Build an AI-powered resume assistant.'
  },

  ats: {
    title: 'ATS & Resume Intelligence',
    priority: 'MEDIUM',
    duration: '2–3 days',
    reason: 'Understanding ATS systems helps you optimize resumes for automated recruitment systems.',
    topics: [
      'How ATS works',
      'Resume parsing',
      'Keyword matching',
      'Skill extraction',
      'Job description analysis',
      'ATS-friendly formatting'
    ],
    project: 'Build an ATS resume scoring and keyword matching module.'
  },

  frontend: {
    title: 'Frontend Development',
    priority: 'HIGH',
    duration: '5–7 days',
    reason: 'Frontend development is required for creating user-facing web applications.',
    topics: [
      'HTML',
      'CSS',
      'JavaScript',
      'Responsive design',
      'React',
      'Forms',
      'API integration'
    ],
    project: 'Build a responsive job portal frontend.'
  },

  backend: {
    title: 'Backend Development',
    priority: 'HIGH',
    duration: '5–7 days',
    reason: 'Backend development is required for creating APIs, authentication and server-side functionality.',
    topics: [
      'Node.js',
      'Express',
      'REST APIs',
      'Authentication',
      'Databases',
      'Middleware',
      'Error handling'
    ],
    project: 'Build a complete backend API for a recruitment platform.'
  }
};


/**
 * Converts a missing keyword into a roadmap skill.
 * Handles common variations such as React.js, Node.js, REST API etc.
 */
function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .replace(/[.\-_/]/g, '')
    .replace(/\s+/g, '');
}


/**
 * Generate a learning roadmap from missing keywords.
 */
export function generateLearningRoadmap(
  missingKeywords: string[]
): RoadmapStep[] {

  const roadmap: RoadmapStep[] = [];
  const addedTitles = new Set<string>();

  for (const keyword of missingKeywords) {

    const normalized = normalizeSkill(keyword);

    let matchedKey: string | null = null;

    if (normalized.includes('javascript') || normalized === 'js') {
      matchedKey = 'javascript';

    } else if (normalized.includes('react')) {
      matchedKey = 'react';

    } else if (normalized.includes('express')) {
      matchedKey = 'express';

    } else if (
      normalized.includes('rest') ||
      normalized.includes('api')
    ) {
      matchedKey = normalized.includes('rest')
        ? 'rest'
        : 'apis';

    } else if (normalized.includes('mongodb')) {
      matchedKey = 'mongodb';

    } else if (
      normalized === 'sql' ||
      normalized.includes('mysql') ||
      normalized.includes('postgres')
    ) {
      matchedKey = 'sql';

    } else if (normalized === 'git') {
      matchedKey = 'git';

    } else if (normalized.includes('github')) {
      matchedKey = 'github';

    } else if (normalized.includes('aws')) {
      matchedKey = 'aws';

    } else if (normalized.includes('cloud')) {
      matchedKey = 'cloud';

    } else if (
      normalized === 'ai' ||
      normalized.includes('artificialintelligence')
    ) {
      matchedKey = 'ai';

    } else if (normalized.includes('ats')) {
      matchedKey = 'ats';

    } else if (normalized.includes('frontend')) {
      matchedKey = 'frontend';

    } else if (normalized.includes('backend')) {
      matchedKey = 'backend';
    }

    if (matchedKey) {
      const roadmapItem = ROADMAP_DATA[matchedKey];

      if (
        roadmapItem &&
        !addedTitles.has(roadmapItem.title)
      ) {
        roadmap.push(roadmapItem);
        addedTitles.add(roadmapItem.title);
      }
    }
  }

  // Put HIGH priority topics first
  roadmap.sort((a, b) => {
    const priority = {
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3
    };

    return priority[a.priority] - priority[b.priority];
  });

  return roadmap;
}