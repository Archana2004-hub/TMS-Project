const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const SA = ['SuperAdmin'];

router.route('/').get(protect, authorize(...SA), getAllUsers).post(protect, authorize(...SA), createUser);
router.route('/:id').get(protect, authorize(...SA), getUserById).put(protect, authorize(...SA), updateUser).delete(protect, authorize(...SA), deleteUser);
module.exports = router;
