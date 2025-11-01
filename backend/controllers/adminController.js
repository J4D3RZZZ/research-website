import User from "../models/User.js";

// Get all users by status (pending, accepted, rejected)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = "accepted";
    await user.save();

    res.json({ message: `${user.username} has been approved!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = "rejected";
    await user.save();

    res.json({ message: `${user.username} has been rejected.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Archive user (optional: mark as archived)
export const archiveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isApproved: "archived" });
    res.json({ message: `User ${user.username} archived.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
