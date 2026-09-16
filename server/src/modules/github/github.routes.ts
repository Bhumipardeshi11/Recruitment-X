import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
  getAuthUrl,
  handleCallback,
  getProfile,
  syncProfile,
  disconnectGitHub,
} from './github.controller';

const router = Router();

// Callback is hit by GitHub redirect (no auth header, uses state param)
router.get('/callback', handleCallback);

// Everything else requires auth
router.use(authMiddleware);
router.get('/auth-url', getAuthUrl);
router.get('/profile', getProfile);
router.post('/sync', syncProfile);
router.delete('/disconnect', disconnectGitHub);

export { router as githubRouter };
