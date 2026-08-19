import { Response } from 'express';
import { AuthRequest } from '../types';
import { GitHubService } from '../services/githubService';

export class GitHubController {
  static async auditProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const username = (req.params.username || req.body.username) as string;
      if (!username) {
        res.status(400).json({ success: false, error: 'GitHub username is required.' });
        return;
      }

      const userId = req.user?.userId;
      const result = await GitHubService.auditProfile(username, userId);

      res.status(200).json({
        success: true,
        message: `GitHub developer audit completed for ${username}.`,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
