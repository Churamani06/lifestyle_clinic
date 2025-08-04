const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const db = require('../config/database');
const { handleValidationErrors } = require('../middleware/validation');
const { verifyAdminToken, checkAdminRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules for admin login
const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for admin creation
const createAdminValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .isIn(['super_admin', 'data_entry', 'viewer'])
    .withMessage('Invalid role specified')
];

// @route   POST /api/admin-auth/login
// @desc    Admin login
// @access  Public
router.post('/login', loginValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const [admins] = await db.execute(
      'SELECT admin_id, username, password, role, is_active FROM admins WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const admin = admins[0];

    if (!admin.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is inactive'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    await db.execute(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE admin_id = ?',
      [admin.admin_id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.admin_id, 
        username: admin.username,
        role: admin.role,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Get admin data without password
    const [adminData] = await db.execute(
      'SELECT admin_id, username, role, last_login, created_at FROM admins WHERE admin_id = ?',
      [admin.admin_id]
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        admin: adminData[0]
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin-auth/me
// @desc    Get current admin data
// @access  Private (Admin only)
router.get('/me', verifyAdminToken, async (req, res, next) => {
  try {
    const [adminResult] = await db.execute(
      'SELECT admin_id, username, email, role, created_at FROM admins WHERE admin_id = ?',
      [req.admin.adminId]
    );
    
    if (adminResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const adminData = adminResult[0];

    res.json({
      success: true,
      data: {
        adminId: adminData.admin_id,
        username: adminData.username,
        email: adminData.email,
        role: adminData.role,
        createdAt: adminData.created_at
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   POST /api/admin-auth/create-admin
// @desc    Create new admin (Super admin only)
// @access  Private (Super admin only)
router.post('/create-admin', 
  verifyAdminToken, 
  checkAdminRole(['super_admin']), 
  createAdminValidation, 
  handleValidationErrors, 
  async (req, res, next) => {
    try {
      const { username, password, role } = req.body;

      // Check if admin already exists
      const [existingAdmin] = await db.execute(
        'SELECT admin_id FROM admins WHERE username = ?',
        [username]
      );
      
      if (existingAdmin.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Admin already exists with this username'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new admin
      const [result] = await db.execute(
        'INSERT INTO admins (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role]
      );
      
      const adminId = result.insertId;

      // Get admin data without password
      const [adminResult] = await db.execute(
        'SELECT admin_id, username, role, created_at FROM admins WHERE admin_id = ?',
        [adminId]
      );

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: {
          admin: adminResult[0]
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/admin-auth/admins
// @desc    Get all admins with pagination (Super admin only)
// @access  Private (Super admin only)
router.get('/admins', 
  verifyAdminToken, 
  checkAdminRole(['super_admin']), 
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get total count
      const [countResult] = await db.execute('SELECT COUNT(*) as total FROM admins');
      const total = countResult[0].total;

      // Get admins with pagination
      const [admins] = await db.execute(
        'SELECT admin_id, username, role, created_at, is_active FROM admins ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          admins,
          pagination: {
            currentPage: page,
            totalPages,
            totalAdmins: total,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/admin-auth/admin/:adminId/role
// @desc    Update admin role (Super admin only)
// @access  Private (Super admin only)
router.put('/admin/:adminId/role', 
  verifyAdminToken, 
  checkAdminRole(['super_admin']), 
  [
    body('role')
      .isIn(['super_admin', 'data_entry', 'viewer'])
      .withMessage('Invalid role specified')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { adminId } = req.params;
      const { role } = req.body;

      // Prevent admin from changing their own role
      if (parseInt(adminId) === req.admin.adminId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot change your own role'
        });
      }

      // Update admin role
      const [result] = await db.execute(
        'UPDATE admins SET role = ? WHERE admin_id = ?',
        [role, adminId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.json({
        success: true,
        message: 'Admin role updated successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/admin-auth/admin/:adminId/deactivate
// @desc    Deactivate admin (Super admin only)
// @access  Private (Super admin only)
router.put('/admin/:adminId/deactivate', 
  verifyAdminToken, 
  checkAdminRole(['super_admin']), 
  async (req, res, next) => {
    try {
      const { adminId } = req.params;

      // Prevent admin from deactivating themselves
      if (parseInt(adminId) === req.admin.adminId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own account'
        });
      }

      // Deactivate admin
      const [result] = await db.execute(
        'UPDATE admins SET is_active = FALSE WHERE admin_id = ?',
        [adminId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.json({
        success: true,
        message: 'Admin deactivated successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/admin-auth/logout
// @desc    Admin logout (client-side token removal)
// @access  Private (Admin only)
router.post('/logout', verifyAdminToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Admin logout successful. Please remove the token from client-side storage.'
  });
});

module.exports = router;
