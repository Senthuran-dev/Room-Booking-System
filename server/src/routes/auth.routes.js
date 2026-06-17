const express = require('express');
const { register, login, getMe, updateMe, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(protect);
router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/change-password', changePassword);

module.exports = router;
