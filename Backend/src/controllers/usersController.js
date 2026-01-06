import User from "../models/User.js";

export const getUsers = async (req, res) => {
  const keyword = req.query.role ? { role: req.query.role } : {};
  const users = await User.find({ ...keyword }).select("-password");
  res.json(users);
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};
