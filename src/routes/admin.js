const express = require('express');
const auth = require('../middleware/authmiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');
const { assignAdminRole } = require('../controllers/adminController');
const router = express.Router();



router.put('/assignAdminRole', auth, assignAdminRole)
router.get('/getByCategory', auth, getByCategory)


module.exports = router   