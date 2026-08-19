import { Response } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, fullName, role } = req.body;
      const result = await AuthService.register({ email, password, fullName, role });
      res.status(201).json({
        success: true,
        message: 'Account created successfully. Welcome to RecruitmentX!',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  static async logout(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Tokens cleared on client session.',
    });
  }

  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized session.' });
        return;
      }
      const user = await AuthService.getMe(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
