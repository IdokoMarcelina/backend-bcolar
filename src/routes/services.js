const express = require('express');
const { productPage, getAllService, getArtisanPosts, deleteArtisanPost } = require('../controllers/serviceContoller');
const multer = require('multer');
const auth = require('../middleware/authmiddleware');
const router = express.Router();

const productPicUpload = multer({dest: 'productPics/'})


router.post('/productPage',auth, productPicUpload.array('productPic', 5), productPage);
router.get('/getallService', getAllService);
router.get('/getartisanpost',auth, getArtisanPosts);
router.delete('/deleteartisanpost/:id',auth, deleteArtisanPost);


module.exports = router   