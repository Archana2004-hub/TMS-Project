const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const STAFF = ['Networking Staff','Plumber','Electrician','Software Developer'];

router.get('/dashboard',          protect, ctrl.getDashboard);
router.get('/',                   protect, ctrl.getComplaints);
router.post('/',                  protect, authorize('SuperAdmin','Staff'), upload.single('attachment'), ctrl.createComplaint);
router.get('/:id',                protect, ctrl.getComplaintById);
router.patch('/:id/assign',       protect, authorize('SuperAdmin'), ctrl.assignComplaint);
router.patch('/:id/status',       protect, authorize(...STAFF), ctrl.updateStatus);
module.exports = router;
