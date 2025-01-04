
const express = require('express')
const { createChat, findUserChats, findChat } = require('../controllers/chatController')
const router = express.Router()


router.post('/createChat', createChat)
router.get('/findUserChats/:userId', findUserChats)
router.get('/findChat/:firstId/:secondId', findChat)

module.exports = router;