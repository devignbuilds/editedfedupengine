import express from 'express';
const router = express.Router();
import { getLeads, simulateScrape, getCampaigns, createLead } from '../controllers/leadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.use(protect);
router.use(admin);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.post('/scrape', simulateScrape);
router.get('/campaigns', getCampaigns);

export default router;
