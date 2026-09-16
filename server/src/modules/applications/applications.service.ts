import { prisma } from '../../config/prisma';
import { ApplyInput, ListApplicationsQuery, UpdateApplicationInput } from './applications.validation';
import { NotFoundError, ForbiddenError, ConflictError } from '../../middleware/errorHandler';
import { Prisma, ApplicationStatus } from '@prisma/client';
import { aiService } from '../../services/ai.service';

export class ApplicationsService {
  // ── Apply for a job ──────────────────────────────────────────────────────────
  async apply(candidateId: string, data: ApplyInput) {
    const [job, resume] = await Promise.all([
      prisma.jobDescription.findUnique({ where: { id: data.jobId } }),
      prisma.resume.findUnique({ where: { id: data.resumeId } }),
    ]);

    if (!job) throw new NotFoundError('Job not found');
    if (job.status !== 'PUBLISHED') throw new ForbiddenError('This job is not accepting applications');
    if (!resume) throw new NotFoundError('Resume not found');
    if (resume.userId !== candidateId) throw new ForbiddenError('You do not own this resume');

    // Prevent duplicate applications
    const existing = await prisma.application.findUnique({
      where: { jobId_candidateId: { jobId: data.jobId, candidateId } },
    });
    if (existing) throw new ConflictError('You have already applied for this job');

    // Compute ATS score using AI (optional, non-blocking)
    let atsScore: number | null = null;
    let matchDetails: object | null = null;
    if (resume.parsedText) {
      try {
        const jdText = `${job.title}\n${job.description}\n${job.requiredSkills.join(', ')}`;
        const match = await aiService.computeJobMatch(resume.parsedText, jdText);
        atsScore = match.overallScore;
        matchDetails = match;
      } catch { /* non-fatal */ }
    }

    const application = await prisma.application.create({
      data: {
        jobId: data.jobId,
        candidateId,
        resumeId: data.resumeId,
        coverLetter: data.coverLetter,
        atsScore,
        matchDetails: matchDetails ?? undefined,
        stageHistory: [{ stage: 'APPLIED', movedAt: new Date().toISOString(), movedBy: candidateId }],
      },
      include: {
        job: { select: { title: true, companyName: true } },
        resume: { select: { title: true, fileName: true } },
      },
    });

    // Update job application count
    await prisma.jobDescription.update({
      where: { id: data.jobId },
      data: { applicationCount: { increment: 1 } },
    });

    return application;
  }

  // ── List applications ────────────────────────────────────────────────────────
  async list(query: ListApplicationsQuery, userId: string, role: string) {
    const { page, limit, status, jobId, candidateId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = {};

    if (role === 'CANDIDATE') {
      where.candidateId = userId;
    } else if (role === 'RECRUITER') {
      // Recruiters see apps for their own jobs
      where.job = { userId };
    }
    // ADMIN sees all

    if (status) where.status = status as ApplicationStatus;
    if (jobId) where.jobId = jobId;
    if (candidateId && role !== 'CANDIDATE') where.candidateId = candidateId;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
        include: {
          job: { select: { title: true, companyName: true, companyLogo: true, location: true } },
          candidate: { select: { firstName: true, lastName: true, email: true, avatar: true } },
          resume: { select: { title: true, fileName: true } },
        },
      }),
      prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      pagination: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // ── Get by ID ────────────────────────────────────────────────────────────────
  async getById(id: string, userId: string, role: string) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
        candidate: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true, profile: true } },
        resume: true,
      },
    });
    if (!application) throw new NotFoundError('Application not found');

    const isOwner = application.candidateId === userId;
    const isRecruiter = role === 'RECRUITER' && application.job.userId === userId;
    const isAdmin = role === 'ADMIN';

    if (!isOwner && !isRecruiter && !isAdmin) throw new ForbiddenError('Access denied');

    return application;
  }

  // ── Update status (recruiter) ─────────────────────────────────────────────────
  async update(id: string, userId: string, role: string, data: UpdateApplicationInput) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: { select: { userId: true } } },
    });
    if (!application) throw new NotFoundError('Application not found');

    const isRecruiter = role === 'RECRUITER' && application.job.userId === userId;
    const isCandidate = role === 'CANDIDATE' && application.candidateId === userId;
    const isAdmin = role === 'ADMIN';

    if (!isRecruiter && !isCandidate && !isAdmin) throw new ForbiddenError('Access denied');

    // Candidates can only withdraw
    if (isCandidate && data.status && data.status !== 'WITHDRAWN') {
      throw new ForbiddenError('Candidates can only withdraw their application');
    }

    // Append to stage history
    let stageHistory = (application.stageHistory as any[]) ?? [];
    if (data.status && data.status !== application.status) {
      stageHistory = [...stageHistory, { stage: data.status, movedAt: new Date().toISOString(), movedBy: userId }];
    }

    return prisma.application.update({
      where: { id },
      data: { ...data, stageHistory },
    });
  }

  // ── Withdraw (candidate shorthand) ───────────────────────────────────────────
  async withdraw(id: string, candidateId: string) {
    return this.update(id, candidateId, 'CANDIDATE', { status: 'WITHDRAWN' });
  }
}

export const applicationsService = new ApplicationsService();
