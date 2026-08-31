const Department = require('../models/Department');
const Programme  = require('../models/Programme');
const Block      = require('../models/Block');
const Room       = require('../models/Room');
const Role       = require('../models/Role');

const crudFor = (Model, populateFields = '') => ({
  getAll: async (req, res) => {
    try {
      let query = Model.find({ isActive: true });
      if (populateFields) query = query.populate(populateFields);
      const data = await query.sort({ createdAt: -1 });
      res.json({ success: true, count: data.length, data });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getOne: async (req, res) => {
    try {
      let query = Model.findById(req.params.id);
      if (populateFields) query = query.populate(populateFields);
      const item = await query;
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
  },
  remove: async (req, res) => {
    try {
      await Model.findByIdAndUpdate(req.params.id, { isActive: false });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
});

exports.department = crudFor(Department);
exports.programme  = crudFor(Programme,  'department');
exports.block      = crudFor(Block,      'department programme');
exports.room       = crudFor(Room,       'department programme block');
exports.role       = crudFor(Role);
