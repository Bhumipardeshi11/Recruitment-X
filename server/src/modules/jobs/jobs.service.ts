import { prisma } from '../../config/prisma';
import { CreateJobInput, ListJobsQuery, UpdateJobInput } from './jobs.validation';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';
import { Prisma, JobStatus } from '@prisma/client';

export class JobsService {
  // ── Create ──────────────────────────────────────────────────────────────────
  async create(userId: string, data: CreateJobInput) {
    const job = await prisma.jobDescription.create({
      data: {
        ...data,
        userId,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return job;
  }

  // ── List (with pagination + filtering) ──────────────────────────────────────
  async list(query: ListJobsQuery, requestingUserId?: string, requestingRole?: string) {
    const { page, limit, status, type, experienceLevel, location, isRemote, search, salaryMin, salaryMax } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobDescriptionWhereInput = {};

    // Public listing only shows PUBLISHED jobs unless recruiter viewing own jobs
    if (requestingRole === 'RECRUITER') {
      where.userId = requestingUserId;
      if (status) where.status = status as JobStatus;
    } else {
      where.status = 'PUBLISHED';
    }

    if (type) where.type = type;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (isRemote !== undefined) where.isRemote = isRemote;
    if (salaryMin) where.salaryMin = { gte: salaryMin };
    if (salaryMax) where.salaryMax = { lte: salaryMax };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { requiredSkills: { hasSome: [search] } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.jobDescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          companyName: true,
          companyLogo: true,
          location: true,
          isRemote: true,
          type: true,
          experienceLevel: true,
          experienceYears: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          salaryPeriod: true,
          requiredSkills: true,
          status: true,
          viewCount: true,
          applicationCount: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.jobDescription.count({ where }),
    ]);

    return {
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // ── Get by ID ────────────────────────────────────────────────────────────────
  async getById(id: string, incrementView = false) {
    const job = await prisma.jobDescription.findUnique({ where: { id } });
    if (!job) throw new NotFoundError('Job not found');

    if (incrementView) {
      await prisma.jobDescription.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return job;
  }

  // ── Update ───────────────────────────────────────────────────────────────────
  async update(id: string, userId: string, data: UpdateJobInput) {
    const existing = await prisma.jobDescription.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Job not found');
    if (existing.userId !== userId) throw new ForbiddenError('You do not own this job');

    return prisma.jobDescription.update({
      where: { id },
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  async delete(id: string, userId: string, role: string) {
    const existing = await prisma.jobDescription.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Job not found');
    if (existing.userId !== userId && role !== 'ADMIN') throw new ForbiddenError('You do not own this job');

    await prisma.jobDescription.delete({ where: { id } });
    return { success: true };
  }

  // ── Publish / Close convenience ──────────────────────────────────────────────
  async changeStatus(id: string, userId: string, status: JobStatus) {
    const existing = await prisma.jobDescription.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Job not found');
    if (existing.userId !== userId) throw new ForbiddenError('You do not own this job');

    return prisma.jobDescription.update({ where: { id }, data: { status } });
  }
}

export const jobsService = new JobsService();
