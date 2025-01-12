const User = require('../models/User');

const assignAdminRole = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.user_type = 'admin';
    await user.save();

    res.status(200).json({ message: "User has been assigned admin role.", user });
  } catch (error) {
    res.status(500).json({ message: "Error assigning admin role.", error: error.message });
  }
};


const getAdminDashboard = (req, res) => {
    res.status(200).json({ message: "Welcome to the admin dashboard." });
  };
  

module.exports = {
  assignAdminRole,
  getAdminDashboard
};
