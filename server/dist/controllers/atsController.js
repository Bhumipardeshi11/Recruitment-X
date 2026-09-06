"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtsController = void 0;
const atsService_1 = require("../services/atsService");
class AtsController {
    static async analyze(req, res) {
        try {
            const { resumeText, targetJdText, resumeId, jobDescriptionId } = req.body;
            if (!resumeText) {
                res.status(400).json({ success: false, error: 'Please provide resumeText content to analyze.' });
                return;
            }
            const result = atsService_1.AtsService.analyzeResume(resumeText, targetJdText);
            if (resumeId) {
                await atsService_1.AtsService.saveAnalysis(resumeId, result, jobDescriptionId);
            }
            res.status(200).json({
                success: true,
                message: 'ATS analysis completed successfully.',
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.AtsController = AtsController;
