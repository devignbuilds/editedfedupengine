import express from 'express';
const router = express.Router();
import { getPosts, createPost, generateAIContent } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/', getPosts);
router.post('/', createPost);
router.post('/generate', generateAIContent);

export default router;
