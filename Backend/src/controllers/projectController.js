import Project from "../models/Project.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const {
    name,
    description,
    client,
    employees,
    status,
    deadline,
    budget,
    tags,
  } = req.body;

  // Logic for client-initiated requests
  let projectClient = client;
  let projectStatus = status || "active";

  if (req.user.role === "client") {
    projectClient = req.user._id;
    projectStatus = "pending";
  }

  const project = await Project.create({
    name,
    description,
    client: projectClient,
    employees,
    status: projectStatus,
    deadline,
    budget,
    tags,
  });

  if (project) {
    // Notify admins of new project request/creation
    const admins = await User.find({ role: "admin" });
    const notificationMessage =
      req.user.role === "client"
        ? `New project request from ${req.user.name}: ${name}`
        : `New project created: ${name}`;

    for (const admin of admins) {
      const notification = await createNotification(
        admin._id,
        notificationMessage,
        "project",
        `/projects/${project._id}`,
      );
      if (io && notification) {
        io.emit("notification", notification);
      }
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("project_created", project);
      io.emit("stats_updated");
    }

    res.status(201).json(project);
  } else {
    res.status(400).json({ message: "Invalid project data" });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Admin/Employee see all/assigned, Client sees own)
const getProjects = async (req, res) => {
  let projects;

  if (req.user.role === "admin") {
    projects = await Project.find({})
      .populate("client", "name email")
      .populate("employees", "name email");
  } else if (req.user.role === "employee") {
    projects = await Project.find({ employees: req.user._id })
      .populate("client", "name email")
      .populate("employees", "name email");
  } else {
    // Client
    projects = await Project.find({ client: req.user._id })
      .populate("client", "name email")
      .populate("employees", "name email");
  }

  res.json(projects);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("client", "name email")
    .populate("employees", "name email");

  if (project) {
    // Check access rights
    if (
      req.user.role !== "admin" &&
      project.client._id.toString() !== req.user._id.toString() &&
      !project.employees.some(
        (emp) => emp._id.toString() === req.user._id.toString(),
      )
    ) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    res.json(project);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    // Check authorization: Admin or assigned Employee
    const isAdmin = req.user.role === "admin";
    const isAssignedEmployee =
      req.user.role === "employee" &&
      project.employees.some(
        (emp) => emp.toString() === req.user._id.toString(),
      );

    if (!isAdmin && !isAssignedEmployee) {
      res
        .status(403)
        .json({ message: "Not authorized to update this project" });
      return;
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.client = req.body.client || project.client;
    project.employees = req.body.employees || project.employees;
    project.status = req.body.status || project.status;
    project.deadline = req.body.deadline || project.deadline;
    project.budget = req.body.budget || project.budget;
    project.tags = req.body.tags || project.tags;

    const updatedProject = await project.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("project_updated", updatedProject);
      io.emit("stats_updated");
    }

    res.json(updatedProject);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();

    const io = req.app.get("io");
    if (io) {
      io.emit("project_deleted", req.params.id);
      io.emit("stats_updated");
    }

    res.json({ message: "Project removed" });
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
