const express = require('express');
const auth = require('../middleware/authmiddleware');
const { createMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();



router.post('/createmessage',  createMessage)
router.get('/fetchAllMessages',  getMessages );



module.exports = router   


