
const express = require('express');
const multer = require('multer');
const idCardUpload = multer({ dest: 'id_cards/' });
const { register, login, forgetPassword, resetPassword, logout, getAllUsers, getArtisans, dashboard } = require('../controllers/authController');
const auth = require('../middleware/authmiddleware');
const {seedData} = require('../../seed');
const { getLeastRatedArtisans, getMostRatedArtisans } = require('../controllers/ratingAndReviewController');

const router = express.Router();
router.post('/register',idCardUpload.single('idCard'), register);
router.post('/login', login);
router.get('/mydashboard',auth, dashboard);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword', resetPassword);
router.post('/logout', auth, logout);
router.get('/getAllUsers', auth,  getAllUsers);
router.get('/getAllArtisans', auth,  getArtisans);
router.get('/least-rated', auth,  getLeastRatedArtisans);
router.get('/most-rated', auth,  getMostRatedArtisans);
router.get('/seed', seedData);

// router.get('/getuser', getUser);

module.exports = router;

