import { Router } from 'express';
import { profileController } from './profile.controller';
import { authMiddleware, requireRole } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createCandidateProfileSchema,
  updateCandidateProfileSchema,
  createRecruiterProfileSchema,
  updateRecruiterProfileSchema,
} from './profile.validation';

const router = Router();

router.get('/candidate/me', authMiddleware, requireRole('CANDIDATE', 'ADMIN'), profileController.getMyCandidateProfile);
router.post('/candidate', authMiddleware, requireRole('CANDIDATE', 'ADMIN'), validate(createCandidateProfileSchema), profileController.createCandidateProfile);
router.patch('/candidate', authMiddleware, requireRole('CANDIDATE', 'ADMIN'), validate(updateCandidateProfileSchema), profileController.updateCandidateProfile);

router.get('/recruiter/me', authMiddleware, requireRole('RECRUITER', 'ADMIN'), profileController.getMyRecruiterProfile);
router.post('/recruiter', authMiddleware, requireRole('RECRUITER', 'ADMIN'), validate(createRecruiterProfileSchema), profileController.createRecruiterProfile);
router.patch('/recruiter', authMiddleware, requireRole('RECRUITER', 'ADMIN'), validate(updateRecruiterProfileSchema), profileController.updateRecruiterProfile);

router.get('/candidate/:userId', authMiddleware, profileController.getPublicCandidateProfile);
router.get('/recruiter/:userId', authMiddleware, profileController.getPublicRecruiterProfile);

router.get('/search/candidates', authMiddleware, requireRole('RECRUITER', 'ADMIN'), profileController.searchCandidates);

export { router as profileRoutes };