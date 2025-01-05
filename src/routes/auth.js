
const express = require('express');
const multer = require('multer');
const idCardUpload = multer({ dest: 'id_cards/' });
const { register, login, forgetPassword, resetPassword, logout } = require('../controllers/authController');
const auth = require('../middleware/authmiddleware');
const {seedData} = require('../../seed');

const router = express.Router();
router.post('/register',idCardUpload.single('idCard'), register);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword', resetPassword);
router.get('/logout', auth, logout);
router.get('/seed', seedData);

// router.get('/getuser', getUser);

module.exports = router;

