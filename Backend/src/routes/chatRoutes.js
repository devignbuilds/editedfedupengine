import express from 'express';
import { getMessagesByProject } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/project/:projectId')
  .get(protect, getMessagesByProject);

export default router;
