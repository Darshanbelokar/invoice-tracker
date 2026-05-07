const express = require('express');
const cors = require('cors');
const { authenticateToken, errorHandler, requestLogger } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(requestLogger); // Log all requests

// auth routes (public)
app.use('/api/auth', require('./routes/authRoute'));

// protected routes (require authentication)
app.use('/api/clients', authenticateToken, require('./routes/clientRoute'));
app.use('/api/email', authenticateToken, require('./routes/emailRoute'));
app.use('/api/invoice', authenticateToken, require('./routes/invoiceRoute'));
app.use('/api/payment', authenticateToken, require('./routes/paymentRoute'));
app.use('/api/invoices', require('./routes/pdfRoute'));
app.use('/api/user', authenticateToken, require('./routes/userRoute'))  ;

// test route
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