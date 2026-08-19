import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, ProfileController.getProfile);
router.put('/', authenticate, ProfileController.updateProfile);
router.post('/skills', authenticate, ProfileController.addSkill);
router.post('/experiences', authenticate, ProfileController.addExperience);
router.post('/educations', authenticate, ProfileController.addEducation);
router.post('/projects', authenticate, ProfileController.addProject);

export default router;
