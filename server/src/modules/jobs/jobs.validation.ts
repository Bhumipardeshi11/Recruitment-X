import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    companyName: z.string().min(2).max(200),
    companyLogo: z.string().url().optional(),
    description: z.string().min(50),
    requirements: z.array(z.string()).default([]),
    responsibilities: z.array(z.string()).default([]),
    niceToHave: z.array(z.string()).default([]),
    requiredSkills: z.array(z.string()).min(1, 'At least one required skill'),
    preferredSkills: z.array(z.string()).default([]),
    location: z.string().min(2),
    isRemote: z.boolean().default(false),
    type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'exec']),
    experienceYears: z.string().optional(),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    salaryCurrency: z.string().length(3).default('USD'),
    salaryPeriod: z.enum(['yearly', 'monthly', 'hourly']).default('yearly'),
    benefits: z.array(z.string()).default([]),
    expiresAt: z.string().datetime().optional(),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({ id: z.string() }),
  body: createJobSchema.shape.body.partial().extend({
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']).optional(),
  }),
});

export const listJobsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']).optional(),
    type: z.string().optional(),
    experienceLevel: z.string().optional(),
    location: z.string().optional(),
    isRemote: z.coerce.boolean().optional(),
    search: z.string().optional(),
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
  }),
});

export type CreateJobInput = z.infer<typeof createJobSchema>['body'];
export type UpdateJobInput = z.infer<typeof updateJobSchema>['body'];
export type ListJobsQuery = z.infer<typeof listJobsSchema>['query'];
