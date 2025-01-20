const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');


const getUser = async (req, res) => {
  try {
    const userId = req.user._id; // Access the user ID from req.user, which is set by the auth middleware
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User retrieved successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

  

  const loginStatus = async (req,res)=>{

    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.json(false)
    }

    const verified = jwt.verify(token, "secret_key")

    if(verified){
        return res.json(true)
    }
    return res.json(false)
  }

  
  const updateUser = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (user) {
        const { user_type } = user;
        let cloudImage = null;
  
        // Update other user fields
        Object.assign(user, {
          name: req.body.name || user.name,
          phone: req.body.phone || user.phone,
          LGA: req.body.regionLGA || user.LGA,
          bio: req.body.bio || user.bio,
        });
  
        // Handle artisan-specific fields
        if (user_type === 'artisan') {
          Object.assign(user, {
            state: req.body.state || user.state,
            officeAddress: req.body.officeAddress || user.officeAddress,
            skill: req.body.skill || user.skill,
            dateOfBirth: req.body.dateOfBirth || user.dateOfBirth,
            gender: req.body.gender || user.gender,
            about: req.body.about || user.about,
          });
        }
  
        // Avatar update (for all users, not just artisans)
        if (req.file) {
          try {
            cloudImage = await cloudinary.uploader.upload(req.file.path, {
              folder: "profilePics",  // Optional: Folder in Cloudinary
            });
  
            // Save avatar URL
            user.avatar = cloudImage.secure_url;
          } catch (error) {
            return res.status(500).json({ message: "Error uploading image to Cloudinary.", error: error.message });
          }
        }
  
        const updatedUser = await user.save();
  
        res.status(200).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          LGA: updatedUser.LGA,
          state: updatedUser.state,
          officeAddress: updatedUser.officeAddress,
          skill: updatedUser.skill,
          dateOfBirth: updatedUser.dateOfBirth,
          gender: updatedUser.gender,
          idCard: updatedUser.idCard,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          about: updatedUser.about,
        });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
  };
  
  


  module.exports = {
    getUser,
    loginStatus,
    updateUser,
  }