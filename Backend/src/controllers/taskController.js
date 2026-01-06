import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin/Employee)
const createTask = async (req, res) => {
const { title, description, project, assignedTo, status, priority, dueDate, tags } = req.body;

  // Verify project exists
  const projectExists = await Project.findById(project);
  if (!projectExists) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo,
    status,
    priority,
    dueDate,
    tags,
  });

  if (task) {
    if (assignedTo) {
      await createNotification(
        assignedTo,
        `You have been assigned a new task: ${title}`,
        'task',
        `/projects/${project}`
      );
    }
    res.status(201).json(task);
  } else {
    res.status(400).json({ message: 'Invalid task data' });
  }
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignedTo', 'name email')
    .populate('project', 'name');
  res.json(tasks);
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.tags = req.body.tags || task.tags;
    
    // Handle attachments logic later if needed
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

export { createTask, getTasksByProject, updateTask, deleteTask };
