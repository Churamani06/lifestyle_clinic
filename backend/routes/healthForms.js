const express = require('express');
const { body, query } = require('express-validator');
const db = require('../config/database');
const { handleValidationErrors } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Generate form ID
const generateFormId = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `F${year}${month}${day}${hour}${minute}${random}`;
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
    .withMessage('Age must be between 1 and 120')
    .toInt(), // Convert to integer
  
  body('gender')
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Gender must be male, female, other, or prefer-not-to-say'),
  
  body('contact')
    .matches(/^(\+91[-\s]?)?[0-9]{10}$/)
    .withMessage('Contact must be a valid 10-digit mobile number (with or without +91)'),
  
  body('completeAddress')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Complete address must be between 10 and 500 characters'),
  
  body('medicalSystem')
    .isIn(['ayurvedic', 'allopathic', 'homeopathic', 'naturopathy', 'any'])
    .withMessage('Medical system must be ayurvedic, allopathic, homeopathic, naturopathy, or any'),
  
  body('primaryIssue')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Primary health concern must be at least 5 characters long and not exceed 1000 characters'),
  
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
    console.log('=== HEALTH FORM SUBMISSION ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    console.log('=============================');
    
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

    // Normalize contact number (remove +91, spaces, hyphens)
    const normalizedContact = contact.replace(/^\+91[-\s]?/, '').replace(/[-\s]/g, '');

    const formId = generateFormId();

    // Handle both regular users and admin users
    const userId = req.user.userId || req.user.adminId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User identification failed'
      });
    }

    // Ensure all parameters are properly defined and not undefined
    const formData = {
      formId: formId,
      userId: userId,
      fullName: String(fullName || '').trim(),
      fatherMotherName: String(fatherMotherName || '').trim(),
      age: isNaN(parseInt(age)) ? 0 : parseInt(age),
      gender: String(gender || '').trim(),
      contact: String(normalizedContact || '').trim(),
      completeAddress: String(completeAddress || '').trim(),
      medicalSystem: String(medicalSystem || '').trim(),
      primaryIssue: String(primaryIssue || '').trim(),
      symptoms: String(symptoms || '').trim()
    };

    console.log('Prepared form data for DB insertion:', formData);

    const [result] = await db.execute(
      `INSERT INTO health_assessment_forms 
       (form_id, user_id, full_name, father_mother_name, age, gender, contact, complete_address, medical_system, primary_issue, symptoms, submitted_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        formData.formId,
        formData.userId,
        formData.fullName,
        formData.fatherMotherName,
        formData.age,
        formData.gender,
        formData.contact,
        formData.completeAddress,
        formData.medicalSystem,
        formData.primaryIssue,
        formData.symptoms
      ]
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
    console.error('=== HEALTH FORM SUBMISSION ERROR ===');
    console.error('Error details:', error);
    console.error('Request body:', req.body);
    console.error('User:', req.user);
    console.error('=====================================');
    
    // Send more specific error information
    res.status(500).json({
      success: false,
      message: 'Failed to submit health form',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

    // Handle both regular users and admin users
    const userId = req.user.userId || req.user.adminId;

    const [forms] = await db.execute(
      `SELECT * FROM health_assessment_forms 
       WHERE user_id = ? 
       ORDER BY submitted_date DESC 
       LIMIT ${limit} OFFSET ${offset}`,
      [userId]
    );

    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM health_assessment_forms WHERE user_id = ?',
      [userId]
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

    // Handle both regular users and admin users
    const userId = req.user.userId || req.user.adminId;

    // Check if the form belongs to the current user
    if (form.user_id !== userId) {
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
    // Handle both regular users and admin users
    const userId = req.user.userId || req.user.adminId;

    // Get all forms for the user
    const [forms] = await db.execute(
      'SELECT * FROM health_assessment_forms WHERE user_id = ? ORDER BY submitted_date DESC',
      [userId]
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
