"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubController = void 0;
const githubService_1 = require("../services/githubService");
class GitHubController {
    static async auditProfile(req, res) {
        try {
            const username = (req.params.username || req.body.username);
            if (!username) {
                res.status(400).json({ success: false, error: 'GitHub username is required.' });
                return;
            }
            const userId = req.user?.userId;
            const result = await githubService_1.GitHubService.auditProfile(username, userId);
            res.status(200).json({
                success: true,
                message: `GitHub developer audit completed for ${username}.`,
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.GitHubController = GitHubController;
