const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Department = require('../models/Department');
const Programme = require('../models/Programme');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email, isActive: true })
      .populate('role', 'name')
      .populate('department', 'name shortName')
      .populate('programme', 'name shortName');

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
        programme: user.programme,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/register-superadmin  (Postman only, first-time setup)
exports.registerSuperAdmin = async (req, res) => {
  try {
    const { userName, phoneNumber, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    let superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
    if (!superAdminRole) superAdminRole = await Role.create({ name: 'SuperAdmin' });

    let dept = await Department.findOne({ shortName: 'ADMIN' });
    if (!dept) dept = await Department.create({ name: 'Administration', shortName: 'ADMIN' });

    let prog = await Programme.findOne({ shortName: 'GEN' });
    if (!prog) prog = await Programme.create({ department: dept._id, name: 'General', shortName: 'GEN' });

    const user = await User.create({
      userName, phoneNumber, email, password,
      role: superAdminRole._id, department: dept._id, programme: prog._id
    });

    res.status(201).json({
      success: true,
      message: 'SuperAdmin created successfully',
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
