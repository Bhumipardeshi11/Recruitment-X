import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { githubService } from './github.service';
import crypto from 'crypto';

// Store OAuth state in-memory (use Redis in production)
const oauthStates = new Map<string, { userId: string; expiresAt: number }>();

export const getAuthUrl = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const state = crypto.randomBytes(16).toString('hex');
    oauthStates.set(state, { userId: req.userId!, expiresAt: Date.now() + 5 * 60 * 1000 });
    const url = githubService.getAuthUrl(state);
    res.json({ success: true, data: { url } });
  } catch (err) { next(err); }
};

export const handleCallback = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { code, state } = req.query as { code: string; state: string };
    const stateData = oauthStates.get(state);

    if (!stateData || Date.now() > stateData.expiresAt) {
      res.status(400).json({ success: false, error: 'Invalid or expired OAuth state' });
      return;
    }
    oauthStates.delete(state);

    const profile = await githubService.connect(stateData.userId, code);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/github?connected=true`);
  } catch (err) { next(err); }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await githubService.getProfile(req.userId!);
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

export const syncProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await githubService.sync(req.userId!);
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

export const disconnectGitHub = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await githubService.disconnect(req.userId!);
    res.json({ success: true, message: 'GitHub account disconnected' });
  } catch (err) { next(err); }
};
