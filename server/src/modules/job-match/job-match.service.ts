import { prisma } from '../../config/prisma';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';
import { aiService } from '../../services/ai.service';
import { MatchStatus } from '@prisma/client';

export class JobMatchService {
  // ── Create or refresh a match ─────────────────────────────────────────────────
  async match(resumeId: string, jobId: string, userId: string) {
    const [resume, job] = await Promise.all([
      prisma.resume.findUnique({ where: { id: resumeId }, select: { id: true, userId: true, parsedText: true } }),
      prisma.jobDescription.findUnique({ where: { id: jobId }, select: { id: true, title: true, description: true, requiredSkills: true } }),
    ]);

    if (!resume) throw new NotFoundError('Resume not found');
    if (!job) throw new NotFoundError('Job not found');
    if (resume.userId !== userId) throw new ForbiddenError('You do not own this resume');
    if (!resume.parsedText) throw new Error('Resume text not extracted. Please re-upload.');

    // Upsert a pending match record
    const jobMatch = await prisma.jobMatch.upsert({
      where: { resumeId_jobId: { resumeId, jobId } },
      create: { resumeId, jobId, status: 'ANALYZING' },
      update: { status: 'ANALYZING', errorMessage: null },
    });

    // Async compute
    const jdText = `${job.title}\n${job.description}\n${job.requiredSkills.join(', ')}`;
    setImmediate(async () => {
      const start = Date.now();
      try {
        const result = await aiService.computeJobMatch(resume.parsedText!, jdText);
        await prisma.jobMatch.update({
          where: { id: jobMatch.id },
          data: {
            status: 'COMPLETED',
            overallScore: result.overallScore,
            skillMatchScore: result.skillMatchScore,
            experienceScore: result.experienceScore,
            educationScore: result.educationScore,
            keywordScore: result.keywordScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            matchedKeywords: result.matchedKeywords,
            missingKeywords: result.missingKeywords,
            strengthPoints: result.strengthPoints,
            gapPoints: result.gapPoints,
            recommendation: result.recommendation,
            processingTime: Date.now() - start,
          },
        });
      } catch (err: any) {
        await prisma.jobMatch.update({
          where: { id: jobMatch.id },
          data: { status: 'FAILED', errorMessage: err.message, processingTime: Date.now() - start },
        });
      }
    });

    return jobMatch;
  }

  // ── List matches for a user ───────────────────────────────────────────────────
  async listByUser(userId: string) {
    return prisma.jobMatch.findMany({
      where: { resume: { userId } },
      include: {
        job: { select: { title: true, companyName: true, location: true, experienceLevel: true } },
        resume: { select: { title: true, fileName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Get by ID ─────────────────────────────────────────────────────────────────
  async getById(id: string, userId: string) {
    const match = await prisma.jobMatch.findUnique({
      where: { id },
      include: {
        resume: { select: { userId: true, title: true } },
        job: true,
      },
    });
    if (!match) throw new NotFoundError('Match not found');
    if (match.resume.userId !== userId) throw new ForbiddenError('Access denied');
    return match;
  }
}

export const jobMatchService = new JobMatchService();
