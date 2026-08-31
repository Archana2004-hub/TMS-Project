const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/masterController');
const { protect, authorize } = require('../middleware/authMiddleware');
const SA = ['SuperAdmin'];

router.route('/').get(protect, ctrl.block.getAll).post(protect, authorize(...SA), ctrl.block.create);
router.route('/:id').get(protect, ctrl.block.getOne).put(protect, authorize(...SA), ctrl.block.update).delete(protect, authorize(...SA), ctrl.block.remove);
module.exports = router;
