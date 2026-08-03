const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const { authenticateToken, errorHandler, requestLogger } = require('./middleware/authMiddleware');

// Load Passport strategy config
require('./config/passport'); 

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

// Add process.env.CLIENT_URL from Render if configured
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(requestLogger); // Log all requests

// Initialize Passport Middleware
app.use(passport.initialize());

// Helper function to establish DB Connection before handling requests
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is missing in environment variables.');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
  }
};

// Ensure DB is connected on incoming requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Auth routes (public)
app.use('/api/auth', require('./routes/authRoute'));

// Protected routes (require authentication)
app.use('/api/clients', authenticateToken, require('./routes/clientRoute'));
app.use('/api/email', authenticateToken, require('./routes/emailRoute'));
app.use('/api/invoice', authenticateToken, require('./routes/invoiceRoute'));
app.use('/api/payment', authenticateToken, require('./routes/paymentRoute'));
app.use('/api/pdf', authenticateToken, require('./routes/pdfRoute'));
app.use('/api/user', authenticateToken, require('./routes/userRoute'));

// Test route
app.get('/', (req, res) => {
  res.send('InvoiceIQ API is running...');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;