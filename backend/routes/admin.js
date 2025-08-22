const express = require('express');
const { body, query } = require('express-validator');
const db = require('../config/database');
const { handleValidationErrors } = require('../middleware/validation');
const { verifyAdminToken, checkAdminRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard/statistics
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard/statistics', verifyAdminToken, async (req, res, next) => {
  try {
    // Get total users
    const [totalUsersResult] = await db.execute(
      'SELECT COUNT(*) as count FROM users'
    );
    const totalUsers = totalUsersResult[0].count;

    // Get total health forms
    const [totalFormsResult] = await db.execute(
      'SELECT COUNT(*) as count FROM health_assessment_forms'
    );
    const totalHealthForms = totalFormsResult[0].count;

    // Get recent submissions (last 30 days)
    const [recentSubmissionsResult] = await db.execute(
      'SELECT COUNT(*) as count FROM health_assessment_forms WHERE submitted_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    const recentSubmissions = recentSubmissionsResult[0].count;

    // Get active users (users who submitted forms in last 30 days)
    const [activeUsersResult] = await db.execute(
      'SELECT COUNT(DISTINCT user_id) as count FROM health_assessment_forms WHERE submitted_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    const activeUsers = activeUsersResult[0].count;

    const dashboardStats = {
      totalUsers,
      totalHealthForms,
      recentSubmissions,
      activeUsers
    };

    res.json({
      success: true,
      data: dashboardStats
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', verifyAdminToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;

    // Get users with pagination
    const [users] = await db.execute(
      `SELECT user_id as id, CONCAT(first_name, " ", last_name) as username, email, created_at as createdAt FROM users ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/users/:userId
// @desc    Get specific user details
// @access  Private (Admin only)
router.get('/users/:userId', verifyAdminToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Get user details
    const [userResult] = await db.execute(
      'SELECT user_id as id, CONCAT(first_name, " ", last_name) as username, email, created_at as createdAt FROM users WHERE user_id = ?',
      [userId]
    );
    
    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult[0];

    // Get user's health forms
    const [healthForms] = await db.execute(
      'SELECT * FROM health_assessment_forms WHERE user_id = ? ORDER BY submitted_date DESC',
      [userId]
    );

    res.json({
      success: true,
      data: {
        user,
        healthForms
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/users/:userId/deactivate
// @desc    Deactivate a user
// @access  Private (Admin only)
router.put('/users/:userId/deactivate', 
  verifyAdminToken, 
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Check if user exists and update their status
      const [result] = await db.execute(
        'UPDATE users SET is_active = FALSE WHERE user_id = ?',
        [userId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/admin/health-forms
// @desc    Get all health assessment forms with filters
// @access  Private (Admin only)
router.get('/health-forms', verifyAdminToken, async (req, res, next) => {
  try {
    console.log('🔍 Fetching health forms...');
    console.log('📋 Query parameters:', req.query);
    
    const { month, year, page = 1, limit = 50 } = req.query;
    
    // For now, let's just get all records and filter in memory to avoid SQL issues
    const basicQuery = `
      SELECT h.*, u.email, CONCAT(u.first_name, ' ', u.last_name) as username
      FROM health_assessment_forms h 
      LEFT JOIN users u ON h.user_id = u.user_id 
      ORDER BY h.submitted_date DESC 
      LIMIT 100
    `;
    
    console.log('📋 Executing basic query:', basicQuery);
    const [allForms] = await db.execute(basicQuery);
    console.log('✅ Query successful, found', allForms.length, 'total records');

    // Apply filters in JavaScript for now
    let filteredForms = allForms;
    
    if (month && month !== 'all') {
      filteredForms = filteredForms.filter(form => {
        const formDate = new Date(form.submitted_date);
        const formMonth = String(formDate.getMonth() + 1).padStart(2, '0');
        return formMonth === month;
      });
      console.log(`📅 After month filter (${month}):`, filteredForms.length, 'records');
    }
    
    if (year && year !== 'all') {
      filteredForms = filteredForms.filter(form => {
        const formDate = new Date(form.submitted_date);
        const formYear = String(formDate.getFullYear());
        return formYear === year;
      });
      console.log(`📅 After year filter (${year}):`, filteredForms.length, 'records');
    }

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const paginatedForms = filteredForms.slice(offset, offset + parseInt(limit));
    
    console.log('📄 Final results:', paginatedForms.length, 'records');

    res.json({
      success: true,
      data: {
        forms: paginatedForms,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredForms.length / parseInt(limit)),
          totalForms: filteredForms.length,
          hasNext: parseInt(page) < Math.ceil(filteredForms.length / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
          filtersApplied: {
            month: month !== 'all' ? month : null,
            year: year !== 'all' ? year : null
          }
        }
      }
    });

  } catch (error) {
    console.error('❌ Health forms fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health forms',
      error: error.message
    });
  }
});

// @route   GET /api/admin/health-forms/:formId
// @desc    Get specific health assessment form
// @access  Private (Admin only)
router.get('/health-forms/:formId', verifyAdminToken, async (req, res, next) => {
  try {
    const { formId } = req.params;
    
    // Get form with user details
    const [formResult] = await db.execute(
      `SELECT h.*, u.email, CONCAT(u.first_name, ' ', u.last_name) as username
       FROM health_assessment_forms h 
       LEFT JOIN users u ON h.user_id = u.user_id 
       WHERE h.id = ?`,
      [formId]
    );
    
    if (formResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Health assessment form not found'
      });
    }

    res.json({
      success: true,
      data: {
        form: formResult[0]
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/health-forms/:formId/status
// @desc    Update health assessment form status
// @access  Private (Admin only)
router.put('/health-forms/:formId/status', 
  verifyAdminToken, 
  [
    body('status')
      .isIn(['submitted', 'reviewed', 'consultation_scheduled', 'completed'])
      .withMessage('Invalid status'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must not exceed 1000 characters'),
    
    body('assignedDoctorId')
      .optional()
      .isInt()
      .withMessage('Assigned doctor ID must be an integer'),
    
    body('consultationDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid consultation date format')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { formId } = req.params;
      const { status, notes, assignedDoctorId, consultationDate } = req.body;
      
      // Update form status
      const [result] = await db.execute(
        `UPDATE health_assessment_forms 
         SET status = ?, admin_notes = ?, assigned_doctor_id = ?, consultation_date = ?, updated_at = NOW()
         WHERE id = ?`,
        [status, notes || null, assignedDoctorId || null, consultationDate || null, formId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Health assessment form not found'
        });
      }

      res.json({
        success: true,
        message: 'Form status updated successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @route   DELETE /api/admin/health-forms/:formId
// @desc    Delete health assessment form
// @access  Private (Admin only)
router.delete('/health-forms/:formId', 
  verifyAdminToken, 
  async (req, res, next) => {
    try {
      const { formId } = req.params;
      
      // Delete the form
      const [result] = await db.execute(
        'DELETE FROM health_assessment_forms WHERE id = ?',
        [formId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Health assessment form not found'
        });
      }

      res.json({
        success: true,
        message: 'Health assessment form deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/admin/reports/monthly-data
// @desc    Get monthly submission data for charts
// @access  Private (Admin only)
router.get('/reports/monthly-data', verifyAdminToken, async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    // Get monthly submission data
    const [monthlyData] = await db.execute(
      `SELECT 
        MONTH(submitted_date) as month,
        COUNT(*) as submissions,
        COUNT(DISTINCT user_id) as uniqueUsers
       FROM health_assessment_forms 
       WHERE YEAR(submitted_date) = ? 
       GROUP BY MONTH(submitted_date) 
       ORDER BY month`,
      [year]
    );

    res.json({
      success: true,
      data: {
        year,
        monthlyData
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
