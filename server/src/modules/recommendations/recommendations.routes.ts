import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { listRecommendations, generateRecommendations, markRead, dismiss } from './recommendations.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', listRecommendations);
router.post('/generate', generateRecommendations);
router.patch('/:id/read', markRead);
router.patch('/:id/dismiss', dismiss);

export { router as recommendationsRouter };
