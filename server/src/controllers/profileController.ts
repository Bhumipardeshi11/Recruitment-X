import { Response } from 'express';
import { AuthRequest } from '../types';
import { ProfileService } from '../services/profileService';

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || (req.params.userId as string);
      const profile = await ProfileService.getProfileByUserId(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }
      const updated = await ProfileService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async addSkill(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { profileId, name, category, proficiency, yearsOfExperience } = req.body;
      const skill = await ProfileService.addSkill(profileId, { name, category, proficiency, yearsOfExperience });
      res.status(201).json({ success: true, data: skill });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async addExperience(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { profileId, ...expData } = req.body;
      const exp = await ProfileService.addExperience(profileId, expData);
      res.status(201).json({ success: true, data: exp });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async addEducation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { profileId, ...eduData } = req.body;
      const edu = await ProfileService.addEducation(profileId, eduData);
      res.status(201).json({ success: true, data: edu });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async addProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { profileId, ...projectData } = req.body;
      const project = await ProfileService.addProject(profileId, projectData);
      res.status(201).json({ success: true, data: project });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
