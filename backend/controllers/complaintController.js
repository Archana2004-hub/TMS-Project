const Complaint = require('../models/Complaint');

// Helper: base populate
const populateComplaint = (query) =>
  query
    .populate('block', 'name')
    .populate('room', 'roomNumber')
    .populate('raisedBy', 'userName email')
    .populate('assignedTo', 'userName email')
    .populate('department', 'name shortName')
    .populate('programme', 'name shortName');

// POST /api/complaints  — User & SuperAdmin
exports.createComplaint = async (req, res) => {
  try {
    const { block, room, complaintType, remarks } = req.body;
    const complaint = await Complaint.create({
      block, room, complaintType, remarks,
      attachment: req.file ? req.file.filename : null,
      raisedBy:   req.user._id,
      department: req.user.department._id,
      programme:  req.user.programme._id,
      statusHistory: [{ status: 'Pending', changedBy: req.user._id, note: 'Complaint raised' }]
    });
    res.status(201).json({ success: true, data: complaint });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// GET /api/complaints  — role-filtered list
exports.getComplaints = async (req, res) => {
  try {
    const roleName = req.user.role.name;
    let filter = {};

    if (roleName === 'SuperAdmin') {
      // SuperAdmin sees all
    } else if (['Networking Staff','Plumber','Electrician','Software Developer'].includes(roleName)) {
      filter.assignedTo = req.user._id;          // Staff see only assigned
    } else {
      filter.raisedBy = req.user._id;            // User sees own
    }

    // Optional query filters
    if (req.query.status)        filter.status        = req.query.status;
    if (req.query.complaintType) filter.complaintType = req.query.complaintType;
    if (req.query.department)    filter.department    = req.query.department;

    const complaints = await populateComplaint(
      Complaint.find(filter).sort({ createdAt: -1 })
    );
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await populateComplaint(Complaint.findById(req.params.id));
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: complaint });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PATCH /api/complaints/:id/assign  — SuperAdmin only
exports.assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (complaint.status === 'Completed')
      return res.status(400).json({ success: false, message: 'Cannot reassign a completed complaint' });

    complaint.assignedTo = assignedTo;
    complaint.status = 'Assigned';
    complaint.statusHistory.push({ status: 'Assigned', changedBy: req.user._id, note: `Assigned by ${req.user.userName}` });
    await complaint.save();
    res.json({ success: true, data: complaint });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// PATCH /api/complaints/:id/status  — Staff only
exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const allowed = ['In-Progress', 'On Hold', 'Completed'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });

    const complaint = await Complaint.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found or not assigned to you' });

    complaint.status = status;
    if (status === 'Completed') complaint.closedAt = new Date();
    complaint.statusHistory.push({ status, changedBy: req.user._id, note: note || '' });
    await complaint.save();
    res.json({ success: true, data: complaint });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// GET /api/complaints/dashboard  — all roles
exports.getDashboard = async (req, res) => {
  try {
    const roleName = req.user.role.name;
    let baseFilter = {};
    if (['Networking Staff','Plumber','Electrician','Software Developer'].includes(roleName)) {
      baseFilter.assignedTo = req.user._id;
    } else if (roleName !== 'SuperAdmin') {
      baseFilter.raisedBy = req.user._id;
    }

    const [total, pending, assigned, inProgress, onHold, completed] = await Promise.all([
      Complaint.countDocuments(baseFilter),
      Complaint.countDocuments({ ...baseFilter, status: 'Pending' }),
      Complaint.countDocuments({ ...baseFilter, status: 'Assigned' }),
      Complaint.countDocuments({ ...baseFilter, status: 'In-Progress' }),
      Complaint.countDocuments({ ...baseFilter, status: 'On Hold' }),
      Complaint.countDocuments({ ...baseFilter, status: 'Completed' }),
    ]);

    res.json({ success: true, data: { total, pending, assigned, inProgress, onHold, completed } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
