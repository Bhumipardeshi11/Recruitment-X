"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const jobService_1 = require("../services/jobService");
const jdAnalyzerService_1 = require("../services/jdAnalyzerService");
class JobController {
    static async analyzeJd(req, res) {
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
            const result = jdAnalyzerService_1.JdAnalyzerService.analyzeJdVsResume(jdText, resumeText || defaultResumeText);
            res.status(200).json({
                success: true,
                message: 'Job Description analysis completed successfully.',
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async createJob(req, res) {
        try {
            const recruiterId = req.user?.userId || 'recruiter-demo-1';
            const job = await jobService_1.JobService.createJob(recruiterId, req.body);
            res.status(201).json({ success: true, message: 'Job posting created.', data: job });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getAllJobs(req, res) {
        try {
            const { query, location } = req.query;
            const jobs = await jobService_1.JobService.getAllJobs({
                query: query,
                location: location,
            });
            res.status(200).json({ success: true, data: jobs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await jobService_1.JobService.getJobById(id);
            if (!job) {
                res.status(404).json({ success: false, error: 'Job description not found.' });
                return;
            }
            res.status(200).json({ success: true, data: job });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async applyOrMatch(req, res) {
        try {
            const candidateId = req.user?.userId || 'guest-candidate-1';
            const { jobId, resumeId, matchPercentage, fitSummary } = req.body;
            const match = await jobService_1.JobService.createMatch(candidateId, jobId, resumeId, {
                matchPercentage: matchPercentage || 88,
                fitSummary,
            });
            res.status(201).json({ success: true, message: 'Application/Match created.', data: match });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.JobController = JobController;
