import path from 'path';
import fs from 'fs';
import { prisma } from '../../config/prisma';
import { UploadResumeInput, AnalyzeResumeInput, UpdateResumeInput } from './resumes.validation';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';
import { aiService } from '../../services/ai.service';

export class ResumesService {
  // ── Upload ───────────────────────────────────────────────────────────────────
  async upload(userId: string, file: Express.Multer.File, data: UploadResumeInput) {
    const fileUrl = `/uploads/${file.filename}`;

    // If marking as default, unset all other defaults
    if (data.isDefault) {
      await prisma.resume.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Extract text from PDF
    let parsedText: string | null = null;
    let parsedData: object | null = null;
    try {
      const buf = fs.readFileSync(file.path);
      const pdfParse = await import('pdf-parse');
      const pdfResult = await pdfParse.default(buf);
      parsedText = pdfResult.text;
      parsedData = { pages: pdfResult.numpages, info: pdfResult.info };
    } catch {
      // PDF parse may fail for non-PDF/encrypted files — non-fatal
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: data.title,
        fileName: file.originalname,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: 'DRAFT',
        isDefault: data.isDefault ?? false,
        parsedText,
        parsedData: parsedData ?? undefined,
      },
    });

    return resume;
  }

  // ── List ─────────────────────────────────────────────────────────────────────
  async list(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, atsScore: true, overallScore: true, status: true, createdAt: true },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // ── Get by ID ────────────────────────────────────────────────────────────────
  async getById(id: string, userId: string) {
    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
    if (!resume) throw new NotFoundError('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenError('Access denied');
    return resume;
  }

  // ── Update ───────────────────────────────────────────────────────────────────
  async update(id: string, userId: string, data: UpdateResumeInput) {
    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Resume not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    if (data.isDefault) {
      await prisma.resume.updateMany({
        where: { userId, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    return prisma.resume.update({ where: { id }, data });
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  async delete(id: string, userId: string) {
    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Resume not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    // Remove file from disk
    const filePath = path.join(process.cwd(), 'uploads', path.basename(existing.fileUrl));
    try { fs.unlinkSync(filePath); } catch { /* file may not exist */ }

    await prisma.resume.delete({ where: { id } });
    return { success: true };
  }

  // ── AI Analysis ──────────────────────────────────────────────────────────────
  async analyze(resumeId: string, userId: string, input: AnalyzeResumeInput) {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) throw new NotFoundError('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenError('Access denied');
    if (!resume.parsedText) throw new Error('Resume text could not be extracted. Please upload a readable PDF.');

    // Fetch job description text for keyword matching if provided
    let jdText: string | null = null;
    if (input.jobDescriptionId) {
      const jd = await prisma.jobDescription.findUnique({ where: { id: input.jobDescriptionId } });
      if (jd) {
        jdText = `${jd.title}\n${jd.description}\n${jd.requiredSkills.join(', ')}`;
      }
    }

    // Create pending analysis record
    const analysis = await prisma.resumeAnalysis.create({
      data: {
        resumeId,
        userId,
        status: 'PROCESSING',
        aiModel: 'gpt-4-turbo',
      },
    });

    // Run AI analysis asynchronously (fire and update DB)
    setImmediate(async () => {
      const start = Date.now();
      try {
        const result = await aiService.analyzeResume(resume.parsedText!, jdText, input.targetKeywords);
        await prisma.resumeAnalysis.update({
          where: { id: analysis.id },
          data: {
            status: 'COMPLETED',
            atsScore: result.atsScore,
            keywordScore: result.keywordScore,
            formatScore: result.formatScore,
            contentScore: result.contentScore,
            readabilityScore: result.readabilityScore,
            overallScore: result.overallScore,
            extractedSkills: result.extractedSkills,
            missingKeywords: result.missingKeywords,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            suggestions: result.suggestions,
            sectionScores: result.sectionScores,
            keywordDensity: result.keywordDensity,
            tokensUsed: result.tokensUsed,
            processingTime: Date.now() - start,
          },
        });
      } catch (err: any) {
        await prisma.resumeAnalysis.update({
          where: { id: analysis.id },
          data: { status: 'FAILED', errorMessage: err.message, processingTime: Date.now() - start },
        });
      }
    });

    return analysis;
  }

  // ── Get analysis by ID ───────────────────────────────────────────────────────
  async getAnalysis(analysisId: string, userId: string) {
    const analysis = await prisma.resumeAnalysis.findUnique({
      where: { id: analysisId },
      include: { resume: { select: { title: true, fileName: true } } },
    });
    if (!analysis) throw new NotFoundError('Analysis not found');
    if (analysis.userId !== userId) throw new ForbiddenError('Access denied');
    return analysis;
  }
}

export const resumesService = new ResumesService();
