import express from 'express';
const router = express.Router();
import { getModuleConfig, updateModuleConfig } from '../controllers/moduleController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/config', getModuleConfig);
router.put('/config', updateModuleConfig);

export default router;
