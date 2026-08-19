import { Router } from 'express';
import { GitHubController } from '../controllers/githubController';

const router = Router();

router.get('/audit/:username', GitHubController.auditProfile);
router.post('/audit', GitHubController.auditProfile);

export default router;
