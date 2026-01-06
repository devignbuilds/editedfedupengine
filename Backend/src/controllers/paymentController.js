import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new invoice
// @route   POST /api/payments/invoices
// @access  Private (Admin)
const createInvoice = async (req, res) => {
  const { projectId, amount, dueDate } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const invoice = await Invoice.create({
    project: projectId,
    client: project.client,
    amount,
    dueDate,
  });

  if (invoice) {
    await createNotification(
      project.client,
      `New invoice created for project ${project.name}: $${amount}`,
      'payment',
      '/client-dashboard'
    );
    res.status(201).json(invoice);
  } else {
    res.status(400).json({ message: 'Invalid invoice data' });
  }
};

// @desc    Get all invoices
// @route   GET /api/payments/invoices
// @access  Private
const getInvoices = async (req, res) => {
  let invoices;

  if (req.user.role === 'admin') {
    invoices = await Invoice.find({})
      .populate('client', 'name email')
      .populate('project', 'name');
  } else {
    invoices = await Invoice.find({ client: req.user._id })
      .populate('project', 'name');
  }

  res.json(invoices);
};

// @desc    Pay invoice (Mock)
// @route   PUT /api/payments/invoices/:id/pay
// @access  Private (Client)
const payInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (invoice) {
    if (invoice.client.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    invoice.status = 'paid';
    const updatedInvoice = await invoice.save();
    
    // Notify admin (assuming first admin found for now, or all admins)
    // For UVP, we'll notify the system/admin
    await createNotification(
      null, // This would normally go to admins. For now, let's just create it.
      `Payment received for project ${invoice._id}: $${invoice.amount}`,
      'payment'
    );

    res.json(updatedInvoice);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
};

export { createInvoice, getInvoices, payInvoice };
