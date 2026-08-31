const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .populate('role', 'name')
      .populate('department', 'name shortName')
      .populate('programme', 'name shortName')
      .select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('role department programme').select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createUser = async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: { ...user.toObject(), password: undefined } });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) delete req.body.password; // use separate change-password route
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('role department programme').select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
