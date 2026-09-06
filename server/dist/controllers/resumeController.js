"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeController = void 0;
const resumeService_1 = require("../services/resumeService");
const atsService_1 = require("../services/atsService");
class ResumeController {
    static async uploadResumeFile(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, error: 'Please upload a PDF or DOCX resume file.' });
                return;
            }
            const userId = req.user?.userId || 'guest-user-1';
            const title = req.body.title;
            const result = await resumeService_1.ResumeService.uploadAndParseResume(userId, req.file, title);
            res.status(201).json({
                success: true,
                message: 'Resume uploaded, extracted, and structured in PostgreSQL successfully!',
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async createResume(req, res) {
        try {
            const userId = req.user?.userId || 'guest-user-1';
            const { title, summary, rawText, templateId } = req.body;
            let fileUrl = '';
            let fileName = '';
            if (req.file) {
                fileUrl = `/uploads/${req.file.filename}`;
                fileName = req.file.originalname;
            }
            const resume = await resumeService_1.ResumeService.createResume(userId, {
                title: title || 'My Software Engineer Resume',
                summary,
                rawText,
                templateId,
                fileUrl,
                fileName,
            });
            if (rawText) {
                const analysis = atsService_1.AtsService.analyzeResume(rawText);
                await atsService_1.AtsService.saveAnalysis(resume.id, analysis);
            }
            res.status(201).json({ success: true, message: 'Resume created successfully.', data: resume });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getUserResumes(req, res) {
        try {
            const userId = req.user?.userId || 'guest-user-1';
            const resumes = await resumeService_1.ResumeService.getUserResumes(userId);
            res.status(200).json({ success: true, data: resumes });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getResumeById(req, res) {
        try {
            const { id } = req.params;
            const resume = await resumeService_1.ResumeService.getResumeById(id);
            if (!resume) {
                res.status(404).json({ success: false, error: 'Resume not found.' });
                return;
            }
            res.status(200).json({ success: true, data: resume });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async updateResume(req, res) {
        try {
            const { id } = req.params;
            const updated = await resumeService_1.ResumeService.updateResume(id, req.body);
            res.status(200).json({ success: true, message: 'Resume updated.', data: updated });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async deleteResume(req, res) {
        try {
            const { id } = req.params;
            await resumeService_1.ResumeService.deleteResume(id);
            res.status(200).json({ success: true, message: 'Resume deleted.' });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.ResumeController = ResumeController;
