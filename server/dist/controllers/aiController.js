"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const aiService_1 = require("../services/aiService");
class AiController {
    static async generateCoverLetter(req, res) {
        try {
            const { resumeSummary, jobTitle, companyName, jdDescription } = req.body;
            if (!jobTitle || !companyName) {
                res.status(400).json({ success: false, error: 'jobTitle and companyName are required.' });
                return;
            }
            const letter = await aiService_1.AiService.generateCoverLetter(resumeSummary || 'Full stack engineer with TypeScript and Node.js expertise.', jobTitle, companyName, jdDescription || '');
            res.status(200).json({ success: true, data: { coverLetter: letter } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async enhanceBullets(req, res) {
        try {
            const { bullets, targetRole } = req.body;
            if (!bullets || !Array.isArray(bullets)) {
                res.status(400).json({ success: false, error: 'Please provide an array of bullets to enhance.' });
                return;
            }
            const enhanced = await aiService_1.AiService.enhanceBulletPoints(bullets, targetRole);
            res.status(200).json({ success: true, data: { bullets: enhanced } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getInterviewPrep(req, res) {
        try {
            const { roleTitle, techStack } = req.body;
            const prep = await aiService_1.AiService.generateInterviewPrep(roleTitle || 'Full Stack Engineer', techStack || ['React', 'Node.js']);
            res.status(200).json({ success: true, data: prep });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.AiController = AiController;
