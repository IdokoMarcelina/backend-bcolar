const User = require('../models/User');

const IsUser = async (req, res, next) => {
  try {
    if (req.user && req.user.user_type === "user") {
      return next(); 
    }

    const user = await User.findById(req.user._id);
    if (user && user.user_type === "user") {
      return next(); 
    }

    return res.status(403).json({ message: "Access denied. Only users are allowed." });
  } catch (error) {
    console.error("Error in IsUser middleware:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

module.exports = {
  IsUser,
};
