import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getTasks,
} from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

export default router;
