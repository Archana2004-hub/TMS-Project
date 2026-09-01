const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

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

const startServer = async (port = Number(process.env.PORT) || 5000) => {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy. Retrying on ${nextPort}...`);
        startServer(nextPort);
        return;
      }

      console.error('Server failed to start:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
