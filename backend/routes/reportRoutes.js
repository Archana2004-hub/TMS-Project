const express = require('express');
const router = express.Router();
const { getComplaintReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/complaints', protect, authorize('SuperAdmin'), getComplaintReport);
module.exports = router;
