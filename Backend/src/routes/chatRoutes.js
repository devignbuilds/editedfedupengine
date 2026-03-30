import express from 'express';
import { getMessagesByProject, getGeneralMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, sendMessage);

router.route('/project/:projectId')
  .get(protect, getMessagesByProject);

router.route('/general')
  .get(protect, getGeneralMessages);

export default router;
