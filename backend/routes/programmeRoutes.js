const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/masterController');
const { protect, authorize } = require('../middleware/authMiddleware');
const SA = ['SuperAdmin'];

router.route('/').get(protect, ctrl.programme.getAll).post(protect, authorize(...SA), ctrl.programme.create);
router.route('/:id').get(protect, ctrl.programme.getOne).put(protect, authorize(...SA), ctrl.programme.update).delete(protect, authorize(...SA), ctrl.programme.remove);
module.exports = router;
