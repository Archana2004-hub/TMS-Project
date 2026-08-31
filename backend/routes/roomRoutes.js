const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/masterController');
const { protect, authorize } = require('../middleware/authMiddleware');
const SA = ['SuperAdmin'];

router.route('/').get(protect, ctrl.room.getAll).post(protect, authorize(...SA), ctrl.room.create);
router.route('/:id').get(protect, ctrl.room.getOne).put(protect, authorize(...SA), ctrl.room.update).delete(protect, authorize(...SA), ctrl.room.remove);
module.exports = router;
