import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { resumeUpload } from '../../middleware/upload';
import {
  listResumes,
  getResume,
  uploadResume,
  updateResume,
  deleteResume,
  analyzeResume,
  getAnalysis,
} from './resumes.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', listResumes);
router.get('/:id', getResume);
router.post('/upload', resumeUpload.single('resume'), uploadResume);
router.patch('/:id', ...updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/analyze', ...analyzeResume);
router.get('/analysis/:analysisId', getAnalysis);

export { router as resumesRouter };
