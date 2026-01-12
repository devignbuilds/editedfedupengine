import express from "express";
import { getUsers, deleteUser, getUserById, updateUser } from "../controllers/usersController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkPermission, PERMISSIONS } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", protect, checkPermission(PERMISSIONS.MANAGE_USERS), getUsers);
router.get("/:id", protect, checkPermission(PERMISSIONS.MANAGE_USERS), getUserById);
router.put("/:id", protect, checkPermission(PERMISSIONS.EDIT_ROLES), updateUser);
router.delete("/:id", protect, checkPermission(PERMISSIONS.DELETE_USERS), deleteUser);

export default router;
