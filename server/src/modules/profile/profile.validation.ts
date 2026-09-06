import { z } from 'zod';

export const createCandidateProfileSchema = z.object({
  body: z.object({
    headline: z.string().max(200).optional(),
    summary: z.string().max(2000).optional(),
    location: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
    website: z.string().url().optional().nullable(),
    linkedin: z.string().url().optional().nullable(),
    github: z.string().url().optional().nullable(),
    twitter: z.string().url().optional().nullable(),
    skills: z.array(z.string()).default([]),
    experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().nullable().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    })).default([]),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().nullable().optional(),
      current: z.boolean().default(false),
      gpa: z.string().optional(),
    })).default([]),
    preferences: z.object({
      jobTypes: z.array(z.string()).default([]),
      locations: z.array(z.string()).default([]),
      remote: z.boolean().default(false),
      salaryMin: z.number().optional(),
      salaryMax: z.number().optional(),
    }).default({}),
  }),
});

export const updateCandidateProfileSchema = createCandidateProfileSchema;

export const createRecruiterProfileSchema = z.object({
  body: z.object({
    companyName: z.string().min(1).max(100),
    companySize: z.string().optional(),
    companyWebsite: z.string().url().optional().nullable(),
    position: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    bio: z.string().max(2000).optional(),
  }),
});

export const updateRecruiterProfileSchema = createRecruiterProfileSchema;

export type CandidateProfileInput = z.infer<typeof createCandidateProfileSchema>['body'];
export type RecruiterProfileInput = z.infer<typeof createRecruiterProfileSchema>['body'];