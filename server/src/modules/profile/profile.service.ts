import { prisma } from '../../config/prisma';
import { NotFoundError, AuthorizationError } from '../../middleware/errorHandler';
import type { CandidateProfileInput, RecruiterProfileInput } from './profile.validation';

export const profileService = {
  getCandidateProfile: async (userId: string) => {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true, role: true },
        },
      },
    });
    return profile;
  },

  createCandidateProfile: async (userId: string, data: CandidateProfileInput) => {
    const existing = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (existing) {
      throw new AuthorizationError('Profile already exists');
    }

    return prisma.candidateProfile.create({
      data: { userId, ...data },
    });
  },

  updateCandidateProfile: async (userId: string, data: Partial<CandidateProfileInput>) => {
    const existing = await prisma.candidateProfile.findUnique({ where: { userId } });
    
    if (existing) {
      return prisma.candidateProfile.update({
        where: { userId },
        data,
      });
    }
    
    // For create, we need required fields - but CandidateProfileInput has all optional except userId
    // So we can just create with provided data
    return prisma.candidateProfile.create({
      data: { userId, ...data },
    });
  },

  getRecruiterProfile: async (userId: string) => {
    const profile = await prisma.recruiterProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true, role: true },
        },
      },
    });
    return profile;
  },

  createRecruiterProfile: async (userId: string, data: RecruiterProfileInput) => {
    const existing = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (existing) {
      throw new AuthorizationError('Profile already exists');
    }

    return prisma.recruiterProfile.create({
      data: { userId, ...data },
    });
  },

  updateRecruiterProfile: async (userId: string, data: Partial<RecruiterProfileInput>) => {
    const existing = await prisma.recruiterProfile.findUnique({ where: { userId } });
    
    if (existing) {
      return prisma.recruiterProfile.update({
        where: { userId },
        data,
      });
    }
    
    // For create, we need required fields - companyName is required
    if (!data.companyName) {
      throw new AuthorizationError('Company name is required');
    }
    
    return prisma.recruiterProfile.create({
      data: { userId, ...data } as RecruiterProfileInput,
    });
  },

  getPublicCandidateProfile: async (userId: string) => {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      select: {
        headline: true,
        summary: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        skills: true,
        experience: true,
        education: true,
        user: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile');
    }

    return profile;
  },

  getPublicRecruiterProfile: async (userId: string) => {
    const profile = await prisma.recruiterProfile.findUnique({
      where: { userId },
      select: {
        companyName: true,
        companySize: true,
        companyWebsite: true,
        position: true,
        department: true,
        bio: true,
        user: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile');
    }

    return profile;
  },

  searchCandidates: async (filters: {
    skills?: string[];
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const { skills, location, search, page = 1, limit = 20 } = filters;

    const where: any = {};

    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { headline: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { skills: { hasSome: search.split(' ') } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [profiles, total] = await Promise.all([
      prisma.candidateProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          userId: true,
          headline: true,
          location: true,
          skills: true,
          user: {
            select: { firstName: true, lastName: true, avatar: true },
          },
        },
      }),
      prisma.candidateProfile.count({ where }),
    ]);

    return {
      profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};