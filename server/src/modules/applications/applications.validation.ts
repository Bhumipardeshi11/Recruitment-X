import { z } from 'zod';

export const applySchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID required'),
    resumeId: z.string().min(1, 'Resume ID required'),
    coverLetter: z.string().max(5000).optional(),
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.enum(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN']).optional(),
    recruiterNotes: z.string().max(5000).optional(),
  }),
});

export const listApplicationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.string().optional(),
    jobId: z.string().optional(),
    candidateId: z.string().optional(),
  }),
});

export type ApplyInput = z.infer<typeof applySchema>['body'];
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>['body'];
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>['query'];
