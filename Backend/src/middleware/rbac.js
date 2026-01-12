export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CLIENT: 'client'
};

export const PERMISSIONS = {
  MANAGE_USERS: [ROLES.ADMIN],
  EDIT_ROLES: [ROLES.ADMIN],
  DELETE_USERS: [ROLES.ADMIN],
  VIEW_ALL_PROJECTS: [ROLES.ADMIN],
  VIEW_ASSIGNED_PROJECTS: [ROLES.EMPLOYEE],
  VIEW_OWN_PROJECTS: [ROLES.CLIENT],
  CREATE_TASKS: [ROLES.ADMIN, ROLES.EMPLOYEE],
  ASSIGN_TASKS: [ROLES.ADMIN],
  UPLOAD_DELIVERABLES: [ROLES.ADMIN, ROLES.EMPLOYEE],
  APPROVE_DELIVERABLES: [ROLES.CLIENT],
  VIEW_INTERNAL_CHAT: [ROLES.ADMIN, ROLES.EMPLOYEE]
};

export const checkPermission = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authorized, no user role found' });
    }

    if (requiredRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized, insufficient permissions' });
    }
  };
};

export const protect = (req, res, next) => {
    // This assumes verifyToken middleware has already properly populated req.user
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
