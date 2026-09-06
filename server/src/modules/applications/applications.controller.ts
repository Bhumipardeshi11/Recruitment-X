import { Response, NextFunction } from 'express';
import { applicationsService } from './applications.service';
import { AuthenticatedRequest } from '../../middleware/auth';
import { applySchema, updateApplicationSchema, listApplicationsSchema } from './applications.validation';
import { zodValidate } from '../../middleware/validate';

export const listApplications = [
  zodValidate(listApplicationsSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await applicationsService.list(req.query as any, req.userId!, req.user!.role);
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  },
];

export const getApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const app = await applicationsService.getById(req.params.id, req.userId!, req.user!.role);
    res.json({ success: true, data: app });
  } catch (err) { next(err); }
};

export const applyForJob = [
  zodValidate(applySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const application = await applicationsService.apply(req.userId!, req.body);
      res.status(201).json({ success: true, data: application });
    } catch (err) { next(err); }
  },
];

export const updateApplication = [
  zodValidate(updateApplicationSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const app = await applicationsService.update(req.params.id, req.userId!, req.user!.role, req.body);
      res.json({ success: true, data: app });
    } catch (err) { next(err); }
  },
];

export const withdrawApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const app = await applicationsService.withdraw(req.params.id, req.userId!);
    res.json({ success: true, data: app });
  } catch (err) { next(err); }
};
