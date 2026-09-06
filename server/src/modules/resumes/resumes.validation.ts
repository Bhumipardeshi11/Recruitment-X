import { z } from 'zod';

export const uploadResumeSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    isDefault: z.coerce.boolean().default(false),
  }),
});

export const analyzeResumeSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    jobDescriptionId: z.string().optional(), // optional: target a specific JD
    targetKeywords: z.array(z.string()).optional(),
  }),
});

export const updateResumeSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    isDefault: z.boolean().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>['body'];
export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>['body'];
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>['body'];
