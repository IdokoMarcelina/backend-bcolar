const express = require('express');
const { productPage, getAllService } = require('../controllers/serviceContoller');
const router = express.Router();


router.post('/productPage', productPage);
router.get('getallService', getAllService);


module.exports = router