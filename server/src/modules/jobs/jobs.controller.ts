import { Request, Response, NextFunction } from 'express';
import { jobsService } from './jobs.service';
import { AuthenticatedRequest } from '../../middleware/auth';
import { createJobSchema, updateJobSchema, listJobsSchema } from './jobs.validation';
import { zodValidate } from '../../middleware/validate';
import { JobStatus } from '@prisma/client';

export const listJobs = [
  zodValidate(listJobsSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await jobsService.list(
        req.query as any,
        req.user?.userId,
        req.user?.role,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },
];

export const getJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const job = await jobsService.getById(req.params.id, true);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const createJob = [
  zodValidate(createJobSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const job = await jobsService.create(req.userId!, req.body);
      res.status(201).json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  },
];

export const updateJob = [
  zodValidate(updateJobSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const job = await jobsService.update(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  },
];

export const deleteJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await jobsService.delete(req.params.id, req.userId!, req.user!.role);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

export const changeJobStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body as { status: JobStatus };
    const job = await jobsService.changeStatus(req.params.id, req.userId!, status);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};
