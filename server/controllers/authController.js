const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const getClientUrl = () => process.env.CLIENT_URL || 'http://localhost:3000';

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'User logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// OAuth Callback Controller (Google/GitHub)
exports.oauthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${getClientUrl()}/login?error=AuthenticationFailed`);
    }

    // Generate JWT token for authenticated OAuth user
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    // Redirect user back to React frontend with token in search params
    res.redirect(`${getClientUrl()}/login?token=${token}`);
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.redirect(`${getClientUrl()}/login?error=OAuthError`);
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_secret_key'
    );

    const user = await User.findById(decoded.userId).select('-password');

    res.status(200).json({
      message: 'Token is valid',
      data: user
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Logout user 
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_secret_key',
      { ignoreExpiration: true }
    );

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Token refreshed successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: newToken
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Error refreshing token', error: error.message });
  }
};

// Send password reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign(
      { userId: user._id, email: user.email, purpose: 'password-reset' },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );

    const resetUrl = `${getClientUrl()}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Invoice App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset your InvoiceAI password',
      html: `
        <h2>Password reset request</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the link below to choose a new password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
      `
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(500).json({ message: 'Error sending password reset email', error: error.message });
      }

      const fallbackToken = jwt.sign(
        { userId: user._id, email: user.email, purpose: 'password-reset' },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Reset email could not be sent. Use the reset link below in development.',
        resetUrl: `${getClientUrl()}/reset-password/${fallbackToken}`
      });
    }

    res.status(500).json({ message: 'Error sending password reset email', error: error.message });
  }
};

// Reset password using a reset token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired reset token', error: error.message });
  }
};