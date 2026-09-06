import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { profileRoutes } from '../modules/profile/profile.routes';
import { jobsRouter } from '../modules/jobs/jobs.routes';
import { resumesRouter } from '../modules/resumes/resumes.routes';
import { applicationsRouter } from '../modules/applications/applications.routes';
import { githubRouter } from '../modules/github/github.routes';
import { recommendationsRouter } from '../modules/recommendations/recommendations.routes';
import { jobMatchRouter } from '../modules/job-match/job-match.routes';

const router = Router();

// ── Status ────────────────────────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    name: 'RecruitmentX API',
    version: '1.0.0',
    status: 'operational',
    endpoints: [
      '/auth', '/profile', '/jobs', '/resumes',
      '/applications', '/github', '/recommendations', '/matches',
    ],
  });
});

// ── Feature Routes ────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/jobs', jobsRouter);
router.use('/resumes', resumesRouter);
router.use('/applications', applicationsRouter);
router.use('/github', githubRouter);
router.use('/recommendations', recommendationsRouter);
router.use('/matches', jobMatchRouter);

export { router };