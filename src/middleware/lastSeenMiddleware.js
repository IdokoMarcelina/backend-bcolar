
const User = require('../models/User');



const updateLastSeen = async (req, res, next) => {
    try {
      if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });
      }
      next();
    } catch (error) {
      console.error('Error updating last seen:', error);
      next(); // Proceed even if there's an error to avoid blocking the request
    }
  };
  
  module.exports = updateLastSeen;
  