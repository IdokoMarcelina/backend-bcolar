
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { register, login, forgetPassword, resetPassword, logout } = require('../controllers/authController');
const auth = require('../middleware/authmiddleware');

const router = express.Router();
router.post('/register',upload.single('idCard'), register);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword', resetPassword);
router.get('/logout', auth, logout);
// router.get('/getuser', getUser);

module.exports = router;

