import { Router } from 'express';
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  duplicateSession
} from '../controllers/sessionController.js';

const router = Router();

router.get('/', getSessions);
router.get('/:id', getSession);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);
router.post('/:id/duplicate', duplicateSession);

export default router;