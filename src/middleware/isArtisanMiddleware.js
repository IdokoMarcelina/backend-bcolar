const User = require('../models/User');

const IsArtisan = async (req, res, next) => {
  try {
    if (req.user && req.user.user_type === "artisan") {
      return next(); 
    }

    const user = await User.findById(req.user._id);
    if (user && user.user_type === "artisan") {
      return next(); 
    }

    return res.status(403).json({ message: "Access denied. Only artisans are allowed." });
  } catch (error) {
    console.error("Error in IsArtisan middleware:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

module.exports = {
  IsArtisan,
};
