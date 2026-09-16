import { Response, NextFunction } from 'express';
import { resumesService } from './resumes.service';
import { AuthenticatedRequest } from '../../middleware/auth';
import { analyzeResumeSchema, updateResumeSchema } from './resumes.validation';
import { zodValidate } from '../../middleware/validate';

export const listResumes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const resumes = await resumesService.list(req.userId!);
    res.json({ success: true, data: resumes });
  } catch (err) { next(err); }
};

export const getResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const resume = await resumesService.getById(req.params.id, req.userId!);
    res.json({ success: true, data: resume });
  } catch (err) { next(err); }
};

export const uploadResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    const resume = await resumesService.upload(req.userId!, req.file, req.body);
    res.status(201).json({ success: true, data: resume });
  } catch (err) { next(err); }
};

export const updateResume = [
  zodValidate(updateResumeSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const resume = await resumesService.update(req.params.id, req.userId!, req.body);
      res.json({ success: true, data: resume });
    } catch (err) { next(err); }
  },
];

export const deleteResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await resumesService.delete(req.params.id, req.userId!);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) { next(err); }
};

export const analyzeResume = [
  zodValidate(analyzeResumeSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const analysis = await resumesService.analyze(req.params.id, req.userId!, req.body);
      res.status(202).json({ success: true, data: analysis, message: 'Analysis started. Poll for results.' });
    } catch (err) { next(err); }
  },
];

export const getAnalysis = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const analysis = await resumesService.getAnalysis(req.params.analysisId, req.userId!);
    res.json({ success: true, data: analysis });
  } catch (err) { next(err); }
};
