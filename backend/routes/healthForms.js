const express = require('express');
const { body, query } = require('express-validator');
const db = require('../config/database');
const { handleValidationErrors } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Generate form ID
const generateFormId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `FORM-${timestamp}-${random}`;
};

// Validation rules for health assessment form
const healthFormValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('fatherMotherName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Father/Mother name must be between 2 and 100 characters'),
  
  body('age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Age must be between 1 and 120'),
  
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('contact')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Contact must be a valid 10-digit Indian mobile number'),
  
  body('completeAddress')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Complete address must be between 10 and 500 characters'),
  
  body('medicalSystem')
    .isIn(['ayurvedic', 'allopathic', 'homeopathic', 'naturopathy'])
    .withMessage('Medical system must be ayurvedic, allopathic, homeopathic, or naturopathy'),
  
  body('primaryIssue')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Primary health concern must be at least 5 characters long (e.g., "back pain", "headaches", "stress management")'),
  
  body('symptoms')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Symptoms must not exceed 1000 characters')
];

// @route   POST /api/health-forms
// @desc    Submit a new health assessment form
// @access  Private
router.post('/', verifyToken, healthFormValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const {
      fullName,
      fatherMotherName,
      age,
      gender,
      contact,
      completeAddress,
      medicalSystem,
      primaryIssue,
      symptoms
    } = req.body;

    const formId = generateFormId();

    const [result] = await db.execute(
      `INSERT INTO health_assessment_forms 
       (form_id, user_id, full_name, father_mother_name, age, gender, contact, complete_address, medical_system, primary_issue, symptoms) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [formId, req.user.userId, fullName, fatherMotherName, age, gender, contact, completeAddress, medicalSystem, primaryIssue, symptoms || '']
    );

    res.status(201).json({
      success: true,
      message: 'Health assessment form submitted successfully',
      data: {
        formId,
        submittedAt: new Date()
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /api/health-forms
// @desc    Get user's health assessment forms with pagination
// @access  Private
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [forms] = await db.execute(
      `SELECT * FROM health_assessment_forms 
       WHERE user_id = ? 
       ORDER BY submitted_date DESC 
       LIMIT ? OFFSET ?`,
      [req.user.userId, limit, offset]
    );

    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM health_assessment_forms WHERE user_id = ?',
      [req.user.userId]
    );

    const total = countResult[0].total;
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
});

// @route   GET /api/health-forms/:formId
// @desc    Get specific health assessment form
// @access  Private
router.get('/:formId', verifyToken, async (req, res, next) => {
  try {
    const { formId } = req.params;
    
    // Get form by ID
    const [formResult] = await db.execute(
      'SELECT * FROM health_assessment_forms WHERE form_id = ?',
      [formId]
    );
    
    if (formResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Health assessment form not found'
      });
    }

    const form = formResult[0];

    // Check if the form belongs to the current user
    if (form.user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        form
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /api/health-forms/statistics/user
// @desc    Get user's form statistics
// @access  Private
router.get('/statistics/user', verifyToken, async (req, res, next) => {
  try {
    // Get all forms for the user
    const [forms] = await db.execute(
      'SELECT * FROM health_assessment_forms WHERE user_id = ? ORDER BY submitted_date DESC',
      [req.user.userId]
    );
    
    const statistics = {
      totalForms: forms.length,
      submittedForms: forms.filter(form => form.status === 'submitted').length,
      reviewedForms: forms.filter(form => form.status === 'reviewed').length,
      scheduledForms: forms.filter(form => form.status === 'consultation_scheduled').length,
      completedForms: forms.filter(form => form.status === 'completed').length,
      recentForms: forms.slice(0, 5) // Last 5 forms
    };

    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
