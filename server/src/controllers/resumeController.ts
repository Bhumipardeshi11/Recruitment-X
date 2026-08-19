import { Response } from 'express';
import { AuthRequest } from '../types';
import { ResumeService } from '../services/resumeService';
import { AtsService } from '../services/atsService';

export class ResumeController {
  static async uploadResumeFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'Please upload a PDF or DOCX resume file.' });
        return;
      }

      const userId = req.user?.userId || 'guest-user-1';
      const title = req.body.title;

      const result = await ResumeService.uploadAndParseResume(userId, req.file, title);

      res.status(201).json({
        success: true,
        message: 'Resume uploaded, extracted, and structured in PostgreSQL successfully!',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createResume(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'guest-user-1';
      const { title, summary, rawText, templateId } = req.body;
      let fileUrl = '';
      let fileName = '';

      if (req.file) {
        fileUrl = `/uploads/${req.file.filename}`;
        fileName = req.file.originalname;
      }

      const resume = await ResumeService.createResume(userId, {
        title: title || 'My Software Engineer Resume',
        summary,
        rawText,
        templateId,
        fileUrl,
        fileName,
      });

      if (rawText) {
        const analysis = AtsService.analyzeResume(rawText);
        await AtsService.saveAnalysis(resume.id, analysis);
      }

      res.status(201).json({ success: true, message: 'Resume created successfully.', data: resume });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getUserResumes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'guest-user-1';
      const resumes = await ResumeService.getUserResumes(userId);
      res.status(200).json({ success: true, data: resumes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getResumeById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resume = await ResumeService.getResumeById(id as string);
      if (!resume) {
        res.status(404).json({ success: false, error: 'Resume not found.' });
        return;
      }
      res.status(200).json({ success: true, data: resume });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateResume(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await ResumeService.updateResume(id as string, req.body);
      res.status(200).json({ success: true, message: 'Resume updated.', data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteResume(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ResumeService.deleteResume(id as string);
      res.status(200).json({ success: true, message: 'Resume deleted.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
