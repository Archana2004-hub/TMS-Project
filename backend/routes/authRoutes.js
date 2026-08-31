const express = require('express');
const router = express.Router();
const { login, registerSuperAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login',                    login);
router.post('/register-superadmin',      registerSuperAdmin);
router.get('/me',          protect,      getMe);
module.exports = router;
