import { Router } from 'express';
import { JobController } from '../controllers/jobController';

const router = Router();

router.post('/analyze-jd', JobController.analyzeJd);
router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);
router.post('/', JobController.createJob);
router.post('/match', JobController.applyOrMatch);

export default router;
