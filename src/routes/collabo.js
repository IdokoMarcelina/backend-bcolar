const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authmiddleware');
const { collaboPage, getAllCollabo, getArticanCollaboPost } = require('../controllers/collaboController');
const router = express.Router();

const productPicUpload = multer({dest: 'collaboPics/'})


router.post('/collaboPage',auth, productPicUpload.array('collaboPic',5), collaboPage)
router.get('/getAllCollabo',auth, getAllCollabo)
router.get('/getArticanCollaboPost',auth, getArticanCollaboPost)



module.exports = router

