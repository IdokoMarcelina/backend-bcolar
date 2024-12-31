
const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authmiddleware');
const { getUser, loginStatus, updateUser } = require('../controllers/profileContoller');
const updateLastSeen = require('../middleware/lastSeenMiddleware');

const profilePicUpload = multer({ dest: 'profilePics/' });
const router = express.Router();

router.get('/getuser',auth,updateLastSeen, getUser);
router.get('/loginstatus', loginStatus);
router.patch('/updateuser',auth, profilePicUpload.single('avatar'),  updateUser);

module.exports = router;

