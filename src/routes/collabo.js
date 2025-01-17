const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authmiddleware');
const { collaboPage, getAllCollabo, getArticanCollaboPost, deleteCollabo,
     viewSpecificCollabo, applyForCollabo, viewApplicationProfile, viewCollaboApplicants } = require('../controllers/collaboController');
const router = express.Router();

const productPicUpload = multer({dest: 'collaboPics/'})


router.post('/collaboPage',auth, productPicUpload.single('collaboPic'), collaboPage)
router.get('/getAllCollabo',auth, getAllCollabo)
router.get('/getArticanCollaboPost/:artisanId',auth, getArticanCollaboPost)
router.get('/viewSpecificCollabo/:id',auth, viewSpecificCollabo)
router.get('/viewApplicationProfile/:id',auth, viewApplicationProfile)
router.get('/viewCollaboApplicants/:collaboId',auth, viewCollaboApplicants)
router.post('/applyForCollabo/:id/apply',auth, applyForCollabo)
router.delete('/deleteCollabo/:collaboId',auth, deleteCollabo)



module.exports = router

