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
      'SELECT COUNT(*) as count FROM healthassessmentforms'
    );
    const totalHealthForms = totalFormsResult[0].count;

    // Get recent submissions (last 30 days)
    const [recentSubmissionsResult] = await db.execute(
      'SELECT COUNT(*) as count FROM healthassessmentforms WHERE submittedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    const recentSubmissions = recentSubmissionsResult[0].count;

    // Get active users (users who submitted forms in last 30 days)
    const [activeUsersResult] = await db.execute(
      'SELECT COUNT(DISTINCT userId) as count FROM healthassessmentforms WHERE submittedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
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
      'SELECT id, username, email, createdAt FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?',
      [limit, offset]
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
      'SELECT id, username, email, createdAt FROM users WHERE id = ?',
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
      'SELECT * FROM healthassessmentforms WHERE userId = ? ORDER BY submittedAt DESC',
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
        'UPDATE users SET isActive = FALSE WHERE id = ?',
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
router.get('/health-forms', 
  verifyAdminToken,
  [
    query('medicalSystem')
      .optional()
      .isIn(['ayurvedic', 'allopathic', 'homeopathic', 'naturopathy', 'any'])
      .withMessage('Invalid medical system filter'),
    
    query('formStatus')
      .optional()
      .isIn(['submitted', 'reviewed', 'consultation_scheduled', 'completed'])
      .withMessage('Invalid form status filter'),
    
    query('dateFrom')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format for dateFrom'),
    
    query('dateTo')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format for dateTo'),
    
    query('month')
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage('Month must be between 1 and 12'),
    
    query('year')
      .optional()
      .isInt({ min: 2020, max: 2030 })
      .withMessage('Year must be between 2020 and 2030')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Build the WHERE clause based on filters
      let whereConditions = [];
      let queryParams = [];

      if (req.query.medicalSystem && req.query.medicalSystem !== 'any') {
        whereConditions.push('medicalSystemPreference = ?');
        queryParams.push(req.query.medicalSystem);
      }

      if (req.query.formStatus) {
        whereConditions.push('status = ?');
        queryParams.push(req.query.formStatus);
      }

      if (req.query.dateFrom) {
        whereConditions.push('submittedAt >= ?');
        queryParams.push(req.query.dateFrom);
      }

      if (req.query.dateTo) {
        whereConditions.push('submittedAt <= ?');
        queryParams.push(req.query.dateTo);
      }

      if (req.query.month) {
        whereConditions.push('MONTH(submittedAt) = ?');
        queryParams.push(parseInt(req.query.month));
      }

      if (req.query.year) {
        whereConditions.push('YEAR(submittedAt) = ?');
        queryParams.push(parseInt(req.query.year));
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ') 
        : '';

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM healthassessmentforms ${whereClause}`;
      const [countResult] = await db.execute(countQuery, queryParams);
      const total = countResult[0].total;

      // Get forms with pagination
      const formsQuery = `
        SELECT h.*, u.username, u.email 
        FROM healthassessmentforms h 
        LEFT JOIN users u ON h.userId = u.id 
        ${whereClause} 
        ORDER BY h.submittedAt DESC 
        LIMIT ? OFFSET ?
      `;
      const [forms] = await db.execute(formsQuery, [...queryParams, limit, offset]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          forms,
          pagination: {
            currentPage: page,
            totalPages,
            totalForms: total,
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

// @route   GET /api/admin/health-forms/:formId
// @desc    Get specific health assessment form
// @access  Private (Admin only)
router.get('/health-forms/:formId', verifyAdminToken, async (req, res, next) => {
  try {
    const { formId } = req.params;
    
    // Get form with user details
    const [formResult] = await db.execute(
      `SELECT h.*, u.username, u.email 
       FROM healthassessmentforms h 
       LEFT JOIN users u ON h.userId = u.id 
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
        `UPDATE healthassessmentforms 
         SET status = ?, adminNotes = ?, assignedDoctorId = ?, consultationDate = ?, updatedAt = NOW()
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
        'DELETE FROM healthassessmentforms WHERE id = ?',
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
        MONTH(submittedAt) as month,
        COUNT(*) as submissions,
        COUNT(DISTINCT userId) as uniqueUsers
       FROM healthassessmentforms 
       WHERE YEAR(submittedAt) = ? 
       GROUP BY MONTH(submittedAt) 
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
