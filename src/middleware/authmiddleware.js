const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key'); 
    const user = await User.findById(verified.id).select("-password") 

    if (!user) {
      return res.status(401).json({ message: 'User not found. Authorization denied.' });
    }

    req.user = user; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token. Authorization denied.', error: error.message });
  }
};

module.exports = auth;
