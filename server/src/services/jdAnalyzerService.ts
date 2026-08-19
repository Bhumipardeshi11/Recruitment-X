export interface JdAnalysisResult {
  jobMatchPercentage: number;
  extractedRoleTitle: string;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export class JdAnalyzerService {
  private static knownTechList = [
    'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma',
    'AWS', 'Docker', 'REST API', 'GraphQL', 'Kubernetes', 'Python', 'Java',
    'Go', 'C++', 'Tailwind CSS', 'Redux', 'MongoDB', 'Redis', 'CI/CD',
    'Jest', 'System Design', 'Microservices', 'Agile', 'Next.js', 'Vite'
  ];

  static analyzeJdVsResume(jdText: string, resumeText: string): JdAnalysisResult {
    const jdLower = (jdText || '').toLowerCase();
    const resumeLower = (resumeText || '').toLowerCase();

    // 1. Extract Role Title if present in JD
    const firstLine = jdText.split('\n')[0] || '';
    const extractedRoleTitle = firstLine.length < 60 ? firstLine.trim() : 'Software Engineering Role';

    // 2. Extract Required Skills & Technologies from JD
    const requiredSkills: string[] = [];
    this.knownTechList.forEach(tech => {
      const regex = new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i');
      if (regex.test(jdText)) {
        requiredSkills.push(tech);
      }
    });

    if (requiredSkills.length === 0) {
      requiredSkills.push('React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'REST API');
    }

    // 3. Compare with Resume
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    requiredSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i');
      if (regex.test(resumeText)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // 4. Missing Keywords (Secondary methodologies / terms)
    const secondaryTerms = ['ci/cd', 'git', 'unit testing', 'microservices', 'agile', 'docker', 'aws'];
    const missingKeywords: string[] = [];
    secondaryTerms.forEach(term => {
      if (jdLower.includes(term) && !resumeLower.includes(term)) {
        missingKeywords.push(term.toUpperCase());
      }
    });

    // 5. Job Match Percentage
    const matchRatio = matchedSkills.length / Math.max(1, requiredSkills.length);
    const jobMatchPercentage = Math.min(100, Math.round(matchRatio * 100));

    // 6. Actionable Tailored Recommendations
    const recommendations: string[] = [];
    if (missingSkills.length > 0) {
      recommendations.push(
        `Incorporate missing core skills into your Technical Skills section: ${missingSkills.join(', ')}.`
      );
    }
    if (missingKeywords.length > 0) {
      recommendations.push(
        `Add relevant experience bullet points demonstrating work with ${missingKeywords.join(', ')}.`
      );
    }
    if (jobMatchPercentage < 80) {
      recommendations.push(
        'Tailor your professional summary to mirror the exact role title and responsibilities mentioned in the job description.'
      );
    } else {
      recommendations.push(
        'Outstanding alignment! You meet over 80% of required technical skills. Ensure your resume highlights metric accomplishments.'
      );
    }

    return {
      jobMatchPercentage,
      extractedRoleTitle,
      matchedSkills,
      missingSkills,
      missingKeywords,
      recommendations,
    };
  }
}
