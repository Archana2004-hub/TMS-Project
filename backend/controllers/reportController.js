const Complaint = require('../models/Complaint');

// GET /api/reports/complaints  — SuperAdmin only
exports.getComplaintReport = async (req, res) => {
  try {
    const filter = { };
    if (req.query.department)    filter.department    = req.query.department;
    if (req.query.programme)     filter.programme     = req.query.programme;
    if (req.query.complaintType) filter.complaintType = req.query.complaintType;
    if (req.query.status)        filter.status        = req.query.status;
    if (req.query.assignedTo)    filter.assignedTo    = req.query.assignedTo;
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to)   filter.createdAt.$lte = new Date(req.query.to);
    }

    const complaints = await Complaint.find(filter)
      .populate('block', 'name')
      .populate('room', 'roomNumber')
      .populate('raisedBy', 'userName email')
      .populate('assignedTo', 'userName email')
      .populate('department', 'name shortName')
      .populate('programme', 'name shortName')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
