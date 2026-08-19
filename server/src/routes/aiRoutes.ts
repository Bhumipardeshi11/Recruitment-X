import { Router } from 'express';
import { AiController } from '../controllers/aiController';

const router = Router();

router.post('/cover-letter', AiController.generateCoverLetter);
router.post('/enhance-bullets', AiController.enhanceBullets);
router.post('/interview-prep', AiController.getInterviewPrep);

export default router;
