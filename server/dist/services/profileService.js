"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const db_1 = require("../config/db");
class ProfileService {
    static async getProfileByUserId(userId) {
        const profile = await db_1.prisma.profile.findUnique({
            where: { userId },
            include: {
                skills: true,
                experiences: { orderBy: { startDate: 'desc' } },
                educations: { orderBy: { startDate: 'desc' } },
                projects: { orderBy: { createdAt: 'desc' } },
                certifications: true,
            },
        }).catch(() => null);
        return profile;
    }
    static async updateProfile(userId, data) {
        const profile = await db_1.prisma.profile.upsert({
            where: { userId },
            update: {
                headline: data.headline,
                bio: data.bio,
                phone: data.phone,
                location: data.location,
                websiteUrl: data.websiteUrl,
                linkedinUrl: data.linkedinUrl,
                githubUrl: data.githubUrl,
                desiredRole: data.desiredRole,
                targetSalary: data.targetSalary,
            },
            create: {
                userId,
                headline: data.headline || 'Full Stack Engineer',
                bio: data.bio,
                phone: data.phone,
                location: data.location,
                websiteUrl: data.websiteUrl,
                linkedinUrl: data.linkedinUrl,
                githubUrl: data.githubUrl,
                desiredRole: data.desiredRole,
                targetSalary: data.targetSalary,
            },
        }).catch(() => data);
        return profile;
    }
    static async addSkill(profileId, skillData) {
        return await db_1.prisma.skills.create({
            data: {
                profileId,
                name: skillData.name,
                category: skillData.category || 'Technical',
                proficiency: skillData.proficiency || 'Intermediate',
                yearsOfExperience: skillData.yearsOfExperience || 1,
            },
        }).catch(() => ({ id: 'skill-' + Date.now(), profileId, ...skillData }));
    }
    static async addExperience(profileId, expData) {
        return await db_1.prisma.experience.create({
            data: {
                profileId,
                company: expData.company,
                position: expData.position,
                location: expData.location,
                startDate: expData.startDate,
                endDate: expData.endDate,
                isCurrent: expData.isCurrent || false,
                description: expData.description,
                bulletPoints: expData.bulletPoints || [],
                technologies: expData.technologies || [],
            },
        }).catch(() => ({ id: 'exp-' + Date.now(), profileId, ...expData }));
    }
    static async addEducation(profileId, eduData) {
        return await db_1.prisma.education.create({
            data: {
                profileId,
                institution: eduData.institution,
                degree: eduData.degree,
                fieldOfStudy: eduData.fieldOfStudy,
                startDate: eduData.startDate,
                endDate: eduData.endDate,
                gpa: eduData.gpa,
            },
        }).catch(() => ({ id: 'edu-' + Date.now(), profileId, ...eduData }));
    }
    static async addProject(profileId, projectData) {
        return await db_1.prisma.projects.create({
            data: {
                profileId,
                title: projectData.title,
                description: projectData.description,
                techStack: projectData.techStack || [],
                githubRepoUrl: projectData.githubRepoUrl,
                liveDemoUrl: projectData.liveDemoUrl,
                highlights: projectData.highlights || [],
            },
        }).catch(() => ({ id: 'proj-' + Date.now(), profileId, ...projectData }));
    }
}
exports.ProfileService = ProfileService;
