"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profileService_1 = require("../services/profileService");
class ProfileController {
    static async getProfile(req, res) {
        try {
            const userId = req.user?.userId || req.params.userId;
            const profile = await profileService_1.ProfileService.getProfileByUserId(userId);
            res.status(200).json({ success: true, data: profile });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Unauthorized.' });
                return;
            }
            const updated = await profileService_1.ProfileService.updateProfile(userId, req.body);
            res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updated });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async addSkill(req, res) {
        try {
            const { profileId, name, category, proficiency, yearsOfExperience } = req.body;
            const skill = await profileService_1.ProfileService.addSkill(profileId, { name, category, proficiency, yearsOfExperience });
            res.status(201).json({ success: true, data: skill });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async addExperience(req, res) {
        try {
            const { profileId, ...expData } = req.body;
            const exp = await profileService_1.ProfileService.addExperience(profileId, expData);
            res.status(201).json({ success: true, data: exp });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async addEducation(req, res) {
        try {
            const { profileId, ...eduData } = req.body;
            const edu = await profileService_1.ProfileService.addEducation(profileId, eduData);
            res.status(201).json({ success: true, data: edu });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async addProject(req, res) {
        try {
            const { profileId, ...projectData } = req.body;
            const project = await profileService_1.ProfileService.addProject(profileId, projectData);
            res.status(201).json({ success: true, data: project });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.ProfileController = ProfileController;
