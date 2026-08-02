const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.authenticateToken = (req, res, next) => {
  try {
    // Check for token in Authorization header first
    let token = null;
    const authHeader = req.headers['authorization'];

    if (authHeader && typeof authHeader === 'string') {
      const [scheme, credentials] = authHeader.split(' ');
      if (scheme?.toLowerCase() === 'bearer' && credentials) {
        token = credentials;
      }
    }

    // Also check for token in query parameters (for file downloads)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = user.userId;
      req.userId = user.userId;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

// Middleware to verify if user owns the resource
exports.authorizeUser = (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;

    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (req.userId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error', error: error.message });
  }
};

// Middleware for error handling
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(500).json({ message: 'Internal server error', error: err.message });
};

exports.requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};
