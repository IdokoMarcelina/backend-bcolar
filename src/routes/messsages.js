const express = require('express');
const auth = require('../middleware/authmiddleware');
const { socketIoHandler, fetchAllMessages } = require('../controllers/messageController');
const router = express.Router();



router.post('/message', auth, socketIoHandler)
router.get('/fetchAllMessages', auth, fetchAllMessages);



module.exports = router   


