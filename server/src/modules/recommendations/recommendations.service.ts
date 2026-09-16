import { prisma } from '../../config/prisma';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';
import { aiService } from '../../services/ai.service';

export class RecommendationsService {
  // ── Get recommendations for user ─────────────────────────────────────────────
  async list(userId: string, unreadOnly = false) {
    return prisma.recommendation.findMany({
      where: {
        userId,
        isDismissed: false,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // ── Generate AI recommendations ───────────────────────────────────────────────
  async generate(userId: string) {
    const [profile, recentAnalysis] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId },
        include: { skills: true, experiences: true, educations: true },
      }),
      prisma.resumeAnalysis.findFirst({
        where: { userId, status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        select: { strengths: true, weaknesses: true, suggestions: true, missingKeywords: true, overallScore: true },
      }),
    ]);

    if (!profile) throw new NotFoundError('Profile not found. Please complete your profile first.');

    const recommendations = await aiService.generateRecommendations(
      {
        skills: profile.skills.map((s) => ({ name: s.name, level: s.level, category: s.category })),
        experiences: profile.experiences.map((e) => ({ company: e.company, title: e.title })),
        educations: profile.educations.map((e) => ({ institution: e.institution, degree: e.degree, field: e.field })),
        headline: profile.headline,
        summary: profile.summary,
      },
      recentAnalysis,
    );

    // Persist to DB
    await prisma.recommendation.createMany({
      data: recommendations.map((r) => ({
        userId,
        type: r.type,
        title: r.title,
        description: r.description,
        priority: r.priority ?? 1,
        actionUrl: r.actionUrl,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })),
    });

    return this.list(userId);
  }

  // ── Mark read ─────────────────────────────────────────────────────────────────
  async markRead(id: string, userId: string) {
    const rec = await prisma.recommendation.findUnique({ where: { id } });
    if (!rec) throw new NotFoundError('Recommendation not found');
    if (rec.userId !== userId) throw new ForbiddenError('Access denied');
    return prisma.recommendation.update({ where: { id }, data: { isRead: true } });
  }

  // ── Dismiss ────────────────────────────────────────────────────────────────────
  async dismiss(id: string, userId: string) {
    const rec = await prisma.recommendation.findUnique({ where: { id } });
    if (!rec) throw new NotFoundError('Recommendation not found');
    if (rec.userId !== userId) throw new ForbiddenError('Access denied');
    return prisma.recommendation.update({ where: { id }, data: { isDismissed: true } });
  }
}

export const recommendationsService = new RecommendationsService();
