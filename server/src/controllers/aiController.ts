import { Response } from 'express';
import { AuthRequest } from '../types';
import { AiService } from '../services/aiService';

export class AiController {
  static async generateCoverLetter(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { resumeSummary, jobTitle, companyName, jdDescription } = req.body;
      if (!jobTitle || !companyName) {
        res.status(400).json({ success: false, error: 'jobTitle and companyName are required.' });
        return;
      }

      const letter = await AiService.generateCoverLetter(
        resumeSummary || 'Full stack engineer with TypeScript and Node.js expertise.',
        jobTitle,
        companyName,
        jdDescription || ''
      );

      res.status(200).json({ success: true, data: { coverLetter: letter } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async enhanceBullets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { bullets, targetRole } = req.body;
      if (!bullets || !Array.isArray(bullets)) {
        res.status(400).json({ success: false, error: 'Please provide an array of bullets to enhance.' });
        return;
      }

      const enhanced = await AiService.enhanceBulletPoints(bullets, targetRole);
      res.status(200).json({ success: true, data: { bullets: enhanced } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getInterviewPrep(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roleTitle, techStack } = req.body;
      const prep = await AiService.generateInterviewPrep(roleTitle || 'Full Stack Engineer', techStack || ['React', 'Node.js']);
      res.status(200).json({ success: true, data: prep });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
