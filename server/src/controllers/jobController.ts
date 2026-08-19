import { Response } from 'express';
import { AuthRequest } from '../types';
import { JobService } from '../services/jobService';
import { JdAnalyzerService } from '../services/jdAnalyzerService';

export class JobController {
  static async analyzeJd(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { jdText, resumeText } = req.body;
      if (!jdText) {
        res.status(400).json({ success: false, error: 'Please paste a Job Description to analyze.' });
        return;
      }

      const defaultResumeText = `Alex Vance
Senior Full Stack & AI Engineer
Email: alex.vance@recruitmentx.ai | San Francisco, CA

SUMMARY
Passionate Full-Stack Engineer with 5+ years of experience building scalable web applications, REST microservices, and AI features using React, TypeScript, Node.js, Express, and PostgreSQL with Prisma.

SKILLS
React, TypeScript, Node.js, Express, PostgreSQL, Prisma ORM, REST API, Tailwind CSS, AWS S3, Docker, Git`;

      const result = JdAnalyzerService.analyzeJdVsResume(jdText, resumeText || defaultResumeText);

      res.status(200).json({
        success: true,
        message: 'Job Description analysis completed successfully.',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recruiterId = req.user?.userId || 'recruiter-demo-1';
      const job = await JobService.createJob(recruiterId, req.body);
      res.status(201).json({ success: true, message: 'Job posting created.', data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllJobs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { query, location } = req.query;
      const jobs = await JobService.getAllJobs({
        query: query as string,
        location: location as string,
      });
      res.status(200).json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getJobById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const job = await JobService.getJobById(id as string);
      if (!job) {
        res.status(404).json({ success: false, error: 'Job description not found.' });
        return;
      }
      res.status(200).json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async applyOrMatch(req: AuthRequest, res: Response): Promise<void> {
    try {
      const candidateId = req.user?.userId || 'guest-candidate-1';
      const { jobId, resumeId, matchPercentage, fitSummary } = req.body;

      const match = await JobService.createMatch(candidateId, jobId, resumeId, {
        matchPercentage: matchPercentage || 88,
        fitSummary,
      });

      res.status(201).json({ success: true, message: 'Application/Match created.', data: match });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
