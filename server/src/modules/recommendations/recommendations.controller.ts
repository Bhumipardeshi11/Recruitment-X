import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { recommendationsService } from './recommendations.service';

export const listRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const unreadOnly = req.query.unreadOnly === 'true';
    const data = await recommendationsService.list(req.userId!, unreadOnly);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const generateRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await recommendationsService.generate(req.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const markRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await recommendationsService.markRead(req.params.id, req.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const dismiss = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await recommendationsService.dismiss(req.params.id, req.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
