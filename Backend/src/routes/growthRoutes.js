import express from 'express';
const router = express.Router();
import { getAffiliateStats, getGamificationStats, triggerAction } from '../controllers/growthController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/affiliate', getAffiliateStats);
router.get('/gamification', getGamificationStats);
router.post('/gamification/action', triggerAction);

export default router;
