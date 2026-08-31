const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/masterController');
const { protect, authorize } = require('../middleware/authMiddleware');
const SA = ['SuperAdmin'];

router.route('/').get(protect, ctrl.role.getAll).post(protect, authorize(...SA), ctrl.role.create);
router.route('/:id').get(protect, ctrl.role.getOne).put(protect, authorize(...SA), ctrl.role.update).delete(protect, authorize(...SA), ctrl.role.remove);
module.exports = router;
