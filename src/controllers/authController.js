const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary');
const bcrypt = require('bcryptjs');


const register = async (req, res) => {
  try {

    const { name, email, password, user_type, phone, regionLGA, state, officeAddress, skill, dateOfBirth, gender } = req.body;

   
    if (!name || !email || !password || !phone || !regionLGA) {
      return res.status(400).json({ message: 'Missing required fields.' , });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter and one special character.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }


    let cloudImage = null;
    if (user_type === 'artisan') {
      if (!state || !officeAddress || !skill || !dateOfBirth || !gender || !req.body.idCard) {
        return res.status(400).json({ message: 'Artisan-specific fields are missing.' });
      }

      cloudImage = await cloudinary.uploader.upload(req.body.idCard, { folder: 'id_cards' });
    
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      user_type,
      regionLGA,
    });
    
    if (user_type === 'artisan') {
      Object.assign(user, {
        state,
        officeAddress,
        skill,
        dateOfBirth,
        gender,
        idCard: cloudImage?.secure_url,
      });
    }    

    await user.save();

  
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    await Otp.create({ user: user._id, otp, type: 'register', expires_at: expiresAt });

    res.status(201).json({ message: 'Registration successful. Check your email for OTP.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await user.comparePassword(password, user.password); // Use model method if available
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, user_type: user.user_type },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      type: 'Bearer',
      expires: new Date().setHours(new Date().getHours() + 24),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};




  const logout = async (req, res) => {
    try {

      res.status(200).json({
  
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
  };



const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await Otp.create({ user: user._id, otp, type: 'forgot-password', expires_at: expiresAt });

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, new_password, confirm_new_password } = req.body;

    if (!email || !new_password || !confirm_new_password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (new_password !== confirm_new_password) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(new_password)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter and one special character.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist.' });
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { 
  register, 
  login, 
  forgetPassword,
   resetPassword,
   logout,
  
 };
