import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import resumeRoutes from './resumeRoutes';
import atsRoutes from './atsRoutes';
import githubRoutes from './githubRoutes';
import jobRoutes from './jobRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ats', atsRoutes);
router.use('/github', githubRoutes);
router.use('/jobs', jobRoutes);
router.use('/ai', aiRoutes);

export default router;
