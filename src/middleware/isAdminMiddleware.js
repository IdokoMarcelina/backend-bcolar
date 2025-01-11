const User = require('../models/User'); 

const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.user_type === 'admin') {
      return next(); 
    }
    
    const user = await User.findById(req.user._id); 
    if (user && user.user_type === 'admin') {
      return next();
    }

    res.status(403).json({ message: "Access denied. Admins only." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = isAdmin;
