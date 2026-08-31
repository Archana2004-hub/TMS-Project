const mongoose = require('mongoose');
const departmentSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true, trim: true },
  shortName: { type: String, required: true, unique: true, trim: true, uppercase: true },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Department', departmentSchema);
