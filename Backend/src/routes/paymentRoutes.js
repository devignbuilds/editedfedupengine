import express from 'express';
import { createInvoice, getInvoices, payInvoice } from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/invoices')
  .post(protect, admin, createInvoice)
  .get(protect, getInvoices);

router.route('/invoices/:id/pay')
  .put(protect, payInvoice);

export default router;
