const express = require('express');
const auth = require('../middleware/authmiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');
const { assignAdminRole, getAdminDashboard } = require('../controllers/adminController');
const router = express.Router();



router.get('/dashboard', auth, isAdmin, getAdminDashboard)
router.put('/assign-admin/:userId', auth, isAdmin, assignAdminRole);


module.exports = router   