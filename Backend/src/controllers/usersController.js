import User from "../models/User.js";

// @desc    Get all users (with filters)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const keyword = req.query.role ? { role: req.query.role } : {};
    // Only fetch non-deleted users by default, unless ?deleted=true
    const deletedFilter =
      req.query.deleted === "true" ? {} : { isDeleted: false };

    const users = await User.find({ ...keyword, ...deletedFilter }).select(
      "-password"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // If the request attempts to remove admin privileges or delete the user,
      // only allow removing the last admin if the requester is Amine@engine.com
      const willRemoveAdmin =
        (req.body.role && req.body.role !== "admin") || req.body.isDeleted;
      if (willRemoveAdmin) {
        // If the requester is NOT Amine, prevent removing/downgrading the last admin
        if (
          !req.user ||
          (req.user.email || "").toLowerCase() !== "amine@engine.com"
        ) {
          const otherAdmins = await User.countDocuments({
            role: "admin",
            isDeleted: false,
            _id: { $ne: user._id },
          });
          if (otherAdmins === 0) {
            return res
              .status(400)
              .json({ message: "Cannot remove or delete the last admin" });
          }
        }
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.isDeleted =
        req.body.isDeleted !== undefined ? req.body.isDeleted : user.isDeleted;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isDeleted: updatedUser.isDeleted,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Soft delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Allow deleting admin users ONLY if the requester is Amine@engine.com
      if (
        user.role === "admin" &&
        (req.user || {}).email?.toLowerCase() !== "amine@engine.com"
      ) {
        res
          .status(403)
          .json({ message: "Only Amine@engine.com can delete admin users" });
        return;
      }

      // Soft delete
      user.isDeleted = true;
      await user.save();
      res.json({ message: "User deactivated (soft deleted)" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
