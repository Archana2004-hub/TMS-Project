const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/programmes',  require('./routes/programmeRoutes'));
app.use('/api/blocks',      require('./routes/blockRoutes'));
app.use('/api/rooms',       require('./routes/roomRoutes'));
app.use('/api/roles',       require('./routes/roleRoutes'));
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/complaints',  require('./routes/complaintRoutes'));
app.use('/api/reports',     require('./routes/reportRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'TMS API running' }));

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('DB connection failed:', err); process.exit(1); });
