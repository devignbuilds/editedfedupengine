import express from 'express';
const router = express.Router();
import { getOrgDetails, updateOrgBranding, getBillingStatus, updatePlan } from '../controllers/orgController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/org', getOrgDetails);
router.put('/org', updateOrgBranding);
router.get('/billing', getBillingStatus);
router.post('/billing/plan', updatePlan);

export default router;
