const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const db = require('../config/database');
const { handleValidationErrors } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules for user registration
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .trim()
    .matches(/^(\+91[-\s]?)?[0-9]{10}$/)
    .withMessage('Please provide a valid Indian mobile number (10 digits, with or without +91)'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  body('agreeToTerms')
    .isBoolean()
    .custom((value) => {
      if (!value) {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    })
];

// Validation rules for user login
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, handleValidationErrors, async (req, res, next) => {
  try {
    console.log('=== SIGNUP REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);
    console.log('====================');
    
    const { firstName, lastName, email, phone, password, agreeToTerms, subscribeNewsletter } = req.body;

    // Normalize phone number (remove +91, spaces, hyphens)
    const normalizedPhone = phone.replace(/^\+91[-\s]?/, '').replace(/[-\s]/g, '');

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const [result] = await db.execute(
      `INSERT INTO users (first_name, last_name, email, phone, password, agree_to_terms, subscribe_newsletter) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, normalizedPhone, hashedPassword, agreeToTerms, subscribeNewsletter || true]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertId, 
        email,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Get user data without password
    const [userData] = await db.execute(
      'SELECT user_id, first_name, last_name, email, phone, registration_time FROM users WHERE user_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userData[0]
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await db.execute(
      'SELECT user_id, first_name, last_name, email, password, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await db.execute(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
      [user.user_id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Get user data without password
    const [userData] = await db.execute(
      'SELECT user_id, first_name, last_name, email, phone, registration_time, last_login FROM users WHERE user_id = ?',
      [user.user_id]
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData[0]
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const [userData] = await db.execute(
      'SELECT user_id, first_name, last_name, email, phone, registration_time, last_login, is_active FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    
    if (userData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: userData[0]
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', verifyToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove the token from client-side storage.'
  });
});

module.exports = router;
