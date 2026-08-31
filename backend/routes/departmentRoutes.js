const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/masterController');
const { protect, authorize } = require('../middleware/authMiddleware');
const SA = ['SuperAdmin'];

router.route('/').get(protect, ctrl.department.getAll).post(protect, authorize(...SA), ctrl.department.create);
router.route('/:id').get(protect, ctrl.department.getOne).put(protect, authorize(...SA), ctrl.department.update).delete(protect, authorize(...SA), ctrl.department.remove);
module.exports = router;
