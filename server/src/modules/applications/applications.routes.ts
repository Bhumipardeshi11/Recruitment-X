import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth';
import {
  listApplications,
  getApplication,
  applyForJob,
  updateApplication,
  withdrawApplication,
} from './applications.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', ...listApplications);
router.get('/:id', getApplication);
router.post('/', requireRole('CANDIDATE'), ...applyForJob);
router.patch('/:id', ...updateApplication);
router.patch('/:id/withdraw', requireRole('CANDIDATE'), withdrawApplication);

export { router as applicationsRouter };
