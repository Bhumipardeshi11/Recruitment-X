import { Router } from 'express';
import { authMiddleware, requireRole, optionalAuthMiddleware } from '../../middleware/auth';
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  changeJobStatus,
} from './jobs.controller';

const router = Router();

// Public (with optional auth for personalization)
router.get('/', optionalAuthMiddleware, ...listJobs);
router.get('/:id', optionalAuthMiddleware, getJob);

// Recruiter / Admin only
router.post('/', authMiddleware, requireRole('RECRUITER', 'ADMIN'), ...createJob);
router.patch('/:id', authMiddleware, requireRole('RECRUITER', 'ADMIN'), ...updateJob);
router.patch('/:id/status', authMiddleware, requireRole('RECRUITER', 'ADMIN'), changeJobStatus);
router.delete('/:id', authMiddleware, requireRole('RECRUITER', 'ADMIN'), deleteJob);

export { router as jobsRouter };
