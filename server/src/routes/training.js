import { Router } from 'express';
import {
  startTraining,
  completeExercise,
  completeTraining,
  getTrainingHistory
} from '../controllers/trainingController.js';

const router = Router();

router.post('/start/:sessionId', startTraining);
router.post('/exercise/:exerciseId/complete', completeExercise);
router.post('/complete/:sessionId', completeTraining);
router.get('/history/:sessionId', getTrainingHistory);

export default router;