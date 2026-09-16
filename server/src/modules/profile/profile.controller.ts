import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { profileService } from './profile.service';
import { NotFoundError } from '../../middleware/errorHandler';

export const profileController = {
  getMyCandidateProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.getCandidateProfile(req.userId!);
      if (!profile) {
        throw new NotFoundError('Candidate profile');
      }
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },

  createCandidateProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.createCandidateProfile(req.userId!, req.body);
      res.status(201).json({ message: 'Profile created', profile });
    } catch (error) {
      next(error);
    }
  },

  updateCandidateProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.updateCandidateProfile(req.userId!, req.body);
      res.json({ message: 'Profile updated', profile });
    } catch (error) {
      next(error);
    }
  },

  getMyRecruiterProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.getRecruiterProfile(req.userId!);
      if (!profile) {
        throw new NotFoundError('Recruiter profile');
      }
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },

  createRecruiterProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.createRecruiterProfile(req.userId!, req.body);
      res.status(201).json({ message: 'Profile created', profile });
    } catch (error) {
      next(error);
    }
  },

  updateRecruiterProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.updateRecruiterProfile(req.userId!, req.body);
      res.json({ message: 'Profile updated', profile });
    } catch (error) {
      next(error);
    }
  },

  getPublicCandidateProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const profile = await profileService.getPublicCandidateProfile(userId);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },

  getPublicRecruiterProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const profile = await profileService.getPublicRecruiterProfile(userId);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },

  searchCandidates: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { skills, location, search, page, limit } = req.query;
      const result = await profileService.searchCandidates({
        skills: skills ? (skills as string).split(',') : undefined,
        location: location as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};