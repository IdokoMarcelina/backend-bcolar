
const express = require('express');
const auth = require('../middleware/authmiddleware');
const { getUser, loginStatus, updateUser } = require('../controllers/profileContoller');
const updateLastSeen = require('../middleware/lastSeenMiddleware');
// const upload = multer({ dest: 'uploads/' });

const router = express.Router();
router.get('/getuser',auth,updateLastSeen, getUser);
router.get('/loginstatus', loginStatus);
router.patch('/updateuser',auth,  updateUser);

module.exports = router;

