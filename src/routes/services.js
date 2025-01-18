const express = require('express');
const { productPage, getAllService, getArtisanPosts, deleteArtisanPost } = require('../controllers/serviceContoller');
const multer = require('multer');
const auth = require('../middleware/authmiddleware');
const {  bookArtisanService, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const getByCategory = require('../controllers/categoryController');
const router = express.Router();

const productPicUpload = multer({dest: 'productPics/'})


router.post('/productPage',auth, productPicUpload.single('productPic'), productPage);
router.get('/getallService', getAllService);
router.get('/getartisanpost/:artisanId',auth, getArtisanPosts);
router.delete('/deleteartisanpost/:id',auth, deleteArtisanPost);
router.post('/bookservice', auth, bookArtisanService)
router.get('/getUserBookings', auth, getUserBookings)
router.put('/cancelBooking/:bookingId', auth, cancelBooking)
router.get('/getByCategory', getByCategory)


module.exports = router   