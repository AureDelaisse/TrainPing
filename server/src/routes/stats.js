import { Router } from 'express';
import {
  getStats,
  getStatsByPeriod
} from '../controllers/statsController.js';

const router = Router();

router.get('/', getStats);
router.get('/period', getStatsByPeriod);

export default router;