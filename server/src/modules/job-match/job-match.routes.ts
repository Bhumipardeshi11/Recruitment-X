import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth';
import { matchResumeToJob, listMatches, getMatch } from './job-match.controller';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('CANDIDATE'));

router.post('/', matchResumeToJob);
router.get('/', listMatches);
router.get('/:id', getMatch);

export { router as jobMatchRouter };
