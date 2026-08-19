import { Response } from 'express';
import { AuthRequest } from '../types';
import { AtsService } from '../services/atsService';

export class AtsController {
  static async analyze(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { resumeText, targetJdText, resumeId, jobDescriptionId } = req.body;

      if (!resumeText) {
        res.status(400).json({ success: false, error: 'Please provide resumeText content to analyze.' });
        return;
      }

      const result = AtsService.analyzeResume(resumeText, targetJdText);

      if (resumeId) {
        await AtsService.saveAnalysis(resumeId, result, jobDescriptionId);
      }

      res.status(200).json({
        success: true,
        message: 'ATS analysis completed successfully.',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
