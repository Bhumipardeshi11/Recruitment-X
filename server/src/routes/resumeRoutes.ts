import { Router } from 'express';
import { ResumeController } from '../controllers/resumeController';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/upload', upload.single('file'), ResumeController.uploadResumeFile);
router.post('/', upload.single('file'), ResumeController.createResume);
router.get('/', ResumeController.getUserResumes);
router.get('/:id', ResumeController.getResumeById);
router.put('/:id', ResumeController.updateResume);
router.delete('/:id', ResumeController.deleteResume);

export default router;
