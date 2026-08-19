import { Router } from 'express';
import { AtsController } from '../controllers/atsController';

const router = Router();

router.post('/score', AtsController.analyze);

export default router;
