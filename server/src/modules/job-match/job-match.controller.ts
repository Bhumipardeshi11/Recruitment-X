import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { jobMatchService } from './job-match.service';

export const matchResumeToJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { resumeId, jobId } = req.body as { resumeId: string; jobId: string };
    if (!resumeId || !jobId) {
      res.status(400).json({ success: false, error: 'resumeId and jobId are required' });
      return;
    }
    const match = await jobMatchService.match(resumeId, jobId, req.userId!);
    res.status(202).json({ success: true, data: match, message: 'Match analysis started. Poll for results.' });
  } catch (err) { next(err); }
};

export const listMatches = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const matches = await jobMatchService.listByUser(req.userId!);
    res.json({ success: true, data: matches });
  } catch (err) { next(err); }
};

export const getMatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const match = await jobMatchService.getById(req.params.id, req.userId!);
    res.json({ success: true, data: match });
  } catch (err) { next(err); }
};
