"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, fullName, role } = req.body;
            const result = await authService_1.AuthService.register({ email, password, fullName, role });
            res.status(201).json({
                success: true,
                message: 'Account created successfully. Welcome to RecruitmentX!',
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService_1.AuthService.login({ email, password });
            res.status(200).json({
                success: true,
                message: 'Authentication successful.',
                data: result,
            });
        }
        catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }
    static async logout(req, res) {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully. Tokens cleared on client session.',
        });
    }
    static async getMe(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Unauthorized session.' });
                return;
            }
            const user = await authService_1.AuthService.getMe(userId);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.AuthController = AuthController;
